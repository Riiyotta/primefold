#!/usr/bin/env python3
"""Adversarial suite: proves every rule rejects a bad instance, and every real template passes.

Controls   : one valid PageSpec is auto-synthesised from EVERY route's template node list (plus the bundled
             example), so adding a template to templates/templates.json is covered with zero new code.
Mutations  : hand-written negatives for schema rules, structure/rhythm rules, runtime (maxWords) and the
             pinned asset policies (including different-but-still-valid values, which a plain enum check
             cannot catch). A coverage check fails if a graph rule has no mutation.

Run:  python3 schema/tests/adversarial_test.py     (repo root derived from __file__; exit 1 on any failure)
"""
import copy
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "schema"))
import semantic_validate as sv  # noqa: E402

CTX = sv.load_context(ROOT)


# ---------------------------------------------------------------- synthesiser
def synth_value(f, path=""):
    t = f["type"]
    if t == "text":
        return "Sample" if f["maxWords"] < 2 else "Sample text"
    if t == "target":
        return "/"
    if t == "link":
        return {"label": "Go", "to": "/"}
    if t == "asset":
        role = CTX["roles"][f["roles"][0]]
        return {"assetRole": role["role"], "assetSource": role["allowedAssetSources"][0], "alt": "Alt text"}
    if t == "list":
        return [synth_value(f["item"]) for _ in range(f["minItems"])]
    if t == "object":
        return {k: synth_value(v) for k, v in f["fields"].items() if v.get("required", True)}
    if t == "enum":
        return f["values"][0]
    if t == "bool":
        return True
    if t == "form":
        return {"endpointRole": f["endpointRole"], "endpoint": "project-owned-placeholder"}
    raise AssertionError("unknown field type " + t)


def synth_content(sec, variant, overrides=None):
    fields = sec["content"]["fields"]
    content = {k: synth_value(v) for k, v in fields.items() if v.get("required", True)}
    content.update(overrides or {})
    for rule in sec.get("rules", []):
        w = rule["when"]
        if "variant" in w and variant != w["variant"]:
            continue
        if "variantNot" in w and variant == w["variantNot"]:
            continue
        if "field" in w and content.get(w["field"]) != w["equals"]:
            continue
        for k in rule.get("require", []):
            content.setdefault(k, synth_value(fields[k]))
        for k in rule.get("forbid", []):
            content.pop(k, None)
        if "countField" in rule:
            lst = content[rule["countField"]]
            while len(lst) < rule["countEquals"]:
                lst.append(copy.deepcopy(lst[-1]))
            del lst[rule["countEquals"]:]
    return content


def synth_spec(route_path, overrides=None):
    route = CTX["routes"][route_path]
    tpl = CTX["templates"][route["template"]]
    nodes = []
    for tn in tpl["nodes"]:
        sec = CTX["sections"][tn["section"]]
        variant = route["variantOverrides"].get(sec["id"]) or (tn.get("variants") or sec["variants"])[0]
        ov = (overrides or {}).get(sec["id"])
        if not tn["required"] and not (overrides or {}).get("_include_optional", True):
            continue
        m = sec["motion"]["allowed"][0]
        nodes.append({"section": sec["id"], "variant": variant, "content": synth_content(sec, variant, ov),
                      "motion": {"pattern": m["pattern"], "trigger": m["trigger"], "reducedMotionFallback": m["reducedMotionFallback"]}})
    return {"pageSpecVersion": "1.0.0", "template": tpl["id"], "route": route_path,
            "meta": {"title": "Synthesised control", "description": "Auto-built from the template node list."}, "nodes": nodes}


def run(spec, ctx=None):
    return sv.validate_all(spec, ctx or CTX)


# ---------------------------------------------------------------- helpers for mutations
def node(spec, section):
    return next(n for n in spec["nodes"] if n["section"] == section)


def example():
    with open(os.path.join(ROOT, "schema", "example.pagespec.json"), encoding="utf-8") as f:
        return json.load(f)


def ctx_without_exception(rule, template, pair=None):
    c = copy.copy(CTX)
    c["graph"] = copy.deepcopy(CTX["graph"])
    ex = c["graph"][rule]["exceptions"]
    c["graph"][rule]["exceptions"] = [e for e in ex if e["template"] != template or (pair and e.get("pair") != pair)]
    return c


MUTATIONS = []  # (name, spec_factory, expected error prefix)


def mut(name, expect):
    def deco(fn):
        MUTATIONS.append((name, fn, expect))
        return fn
    return deco


# ---- schema layer
@mut("schema: unknown template enum value", "SCHEMA")
def _(): s = example(); s["template"] = "template.landing"; return s


@mut("schema: wrong pageSpecVersion", "SCHEMA")
def _(): s = example(); s["pageSpecVersion"] = "9.9.9"; return s


@mut("schema: invented section alias", "SCHEMA")
def _(): s = example(); s["nodes"][1]["section"] = "hero.main"; return s


@mut("schema: missing required content field (slides)", "SCHEMA")
def _(): s = example(); del node(s, "hero.home-carousel")["content"]["slides"]; return s


@mut("schema: missing reducedMotionFallback", "SCHEMA")
def _(): s = example(); del node(s, "hero.home-carousel")["motion"]["reducedMotionFallback"]; return s


@mut("schema: invented motion field", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["motion"]["inventedAnimation"] = "spin"; return s


@mut("schema: motion fallback wrong for the pattern", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["motion"]["reducedMotionFallback"] = "no-animation"; return s


@mut("schema: motion pattern not allowed for this section (valid enum, wrong section)", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["motion"] = {"pattern": "marquee", "trigger": "continuous", "reducedMotionFallback": "static-first-frame"}; return s


@mut("motion: allowed pattern with a trigger the section does not declare (semantic layer)", "MOTION_PAIR")
def _(): s = example(); node(s, "hero.home-carousel")["motion"]["trigger"] = "hover"; return s


@mut("schema: unknown extra property on a node (token override attempt)", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["style"] = {"color": "#ff0000"}; return s


@mut("schema: unknown content field", "SCHEMA")
def _(): s = example(); node(s, "proof.trust")["content"]["tagline"] = "x"; return s


@mut("schema: invented assetRole", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetRole"] = "image"; return s


@mut("schema: invented assetSource", "SCHEMA")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetSource"] = "download-original"; return s


@mut("schema: literal live booking URL as link target", "SCHEMA")
def _(): s = example(); node(s, "conversion.cta-band")["content"]["button"]["to"] = "https://calendly.com/d/dv3b-wwt-mfy/talk-to-primefold"; return s


@mut("schema: unknown destination role", "SCHEMA")
def _(): s = example(); node(s, "conversion.cta-band")["content"]["button"]["to"] = "dest:calendly"; return s


@mut("schema: live form endpoint literal", "SCHEMA")
def _(): s = example(); node(s, "shell.footer")["content"]["newsletter"]["endpoint"] = "https://primefold.ai/api/newsletter"; return s


@mut("schema: wrong form endpointRole for the field", "SCHEMA")
def _(): s = example(); node(s, "shell.footer")["content"]["newsletter"]["endpointRole"] = "endpoint.contact-form"; return s


@mut("schema: variant not in section contract", "SCHEMA")
def _(): s = example(); node(s, "conversion.cta-band")["variant"] = "rainbow"; return s


# ---- structure / rhythm
@mut("structure: duplicate onePerPage section (second hero)", "ONE_PER_PAGE")
def _(): s = example(); s["nodes"].insert(2, copy.deepcopy(node(s, "hero.home-carousel"))); return s


@mut("structure: two HERO-category sections", "ONE_HERO")
def _(): s = example(); s["nodes"].insert(2, copy.deepcopy(node(s, "hero.home-carousel"))); return s


@mut("structure: HERO not directly after navbar", "ONE_HERO")
def _(): s = example(); n = s["nodes"]; n[1], n[2] = n[2], n[1]; return s


@mut("structure: removed mandatory section (testimonials)", "TEMPLATE_NODE_MATCH")
def _(): s = example(); s["nodes"] = [n for n in s["nodes"] if n["section"] != "proof.testimonials"]; return s


@mut("structure: reordered fixed-position section (footer before cta)", "TEMPLATE_NODE_MATCH")
def _(): s = example(); n = s["nodes"]; n[-1], n[-2] = n[-2], n[-1]; return s


@mut("structure: footer not last", "FOOTER_LAST")
def _(): s = example(); n = s["nodes"]; n[-1], n[-2] = n[-2], n[-1]; return s


@mut("structure: navbar not first", "NAVBAR_FIRST")
def _(): s = example(); n = s["nodes"]; n[0], n[1] = n[1], n[0]; return s


@mut("structure: cta not directly before footer", "CTA_BEFORE_FOOTER")
def _(): s = example(); n = s["nodes"]; n[-2], n[-3] = n[-3], n[-2]; return s


@mut("structure: declared template contradicts its own node list", "TEMPLATE_NODE_MATCH")
def _(): s = example(); s["template"] = "template.security"; return s


@mut("structure: route bound to a different template", "ROUTE_TEMPLATE_MATCH")
def _(): s = example(); s["route"] = "/plans"; return s


@mut("structure: unknown route", "ROUTE_TEMPLATE_MATCH")
def _(): s = example(); s["route"] = "/pricing"; return s


@mut("structure: home-only section placed on another template", "SECTION_TEMPLATE_RESTRICTION")
def _():
    s = synth_spec("/plans"); t = synth_spec("/")
    s["nodes"].insert(1, node(t, "proof.testimonials")); return s


@mut("structure: extra non-repeatable section repeated", "TEMPLATE_NODE_MATCH")
def _(): s = example(); i = [n["section"] for n in s["nodes"]].index("proof.trust"); s["nodes"].insert(i + 1, copy.deepcopy(s["nodes"][i])); return s


@mut("structure: adjacent identical (section, variant)", "NO_ADJACENT_SAME_SECTION")
def _(): s = example(); i = [n["section"] for n in s["nodes"]].index("proof.logo-ticker"); s["nodes"].insert(i + 1, copy.deepcopy(s["nodes"][i])); return s


@mut("structure: navbar variant not allowed by template (white on home)", "NODE_VARIANT_ALLOWED")
def _(): s = example(); node(s, "shell.navbar")["variant"] = "white"; return s


@mut("structure: cta variant contradicts routes.json override (xi route using main)", "ROUTE_VARIANT_OVERRIDE")
def _(): s = synth_spec("/experience-intelligence"); node(s, "conversion.cta-band")["variant"] = "main"; return s


@mut("structure: legal route using another legal variant", "ROUTE_VARIANT_OVERRIDE")
def _(): s = synth_spec("/imprint"); node(s, "content.legal-prose")["variant"] = "terms-of-service"; return s


@mut("structure: RI plans page still carrying the comparison table", "PLANS_COMPARISON_TABLE_XI_ONLY")
def _():
    s = synth_spec("/plans"); h = node(s, "hero.pricing")
    h["content"] = synth_content(CTX["sections"]["hero.pricing"], "default", {"product": "RI"}); return s


@mut("structure: XI plans page missing the comparison table", "PLANS_COMPARISON_TABLE_XI_ONLY")
def _(): s = synth_spec("/plans"); s["nodes"] = [n for n in s["nodes"] if n["section"] != "features.comparison-table"]; return s


@mut("content: xi CTA variant without its extra button", "SECTION_CONDITIONAL_RULES")
def _(): s = synth_spec("/experience-intelligence"); del node(s, "conversion.cta-band")["content"]["extraButton"]; return s


@mut("content: non-xi CTA carrying an extra button", "SECTION_CONDITIONAL_RULES")
def _(): s = example(); node(s, "conversion.cta-band")["content"]["extraButton"] = {"label": "Start free trial", "to": "dest:app-trial"}; return s


@mut("content: newsletter index hero without a form", "SECTION_CONDITIONAL_RULES")
def _(): s = synth_spec("/blog"); del node(s, "hero.index-intro")["content"]["newsletter"]; return s


@mut("content: RI pricing hero keeping plan cards", "SECTION_CONDITIONAL_RULES")
def _():
    s = synth_spec("/plans"); h = node(s, "hero.pricing")["content"]
    h["product"] = "RI"; h["riCard"] = synth_value(CTX["sections"]["hero.pricing"]["content"]["fields"]["riCard"]); s["nodes"] = [n for n in s["nodes"] if n["section"] != "features.comparison-table"]; return s


@mut("content: three-up info grid with four cards", "SECTION_CONDITIONAL_RULES")
def _():
    s = synth_spec("/security"); g = node(s, "features.info-card-grid")["content"]["cards"]; g.append(copy.deepcopy(g[0])); return s


# ---- runtime: maxWords
@mut("runtime: maxWords overflow on a text field", "MAX_WORDS")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["title"] = " ".join(["word"] * 40); return s


@mut("runtime: maxWords overflow on a link label", "MAX_WORDS")
def _(): s = example(); node(s, "conversion.cta-band")["content"]["button"]["label"] = "Book a call right now with our team today"; return s


@mut("runtime: maxWords overflow on asset alt", "MAX_WORDS")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["alt"] = " ".join(["alt"] * 20); return s


@mut("runtime: maxWords overflow inside a nested list item", "MAX_WORDS")
def _(): s = example(); node(s, "proof.trust")["content"]["items"][0]["body"] = " ".join(["word"] * 60); return s


# ---- pinned asset policies (different-but-valid values)
@mut("policy: customer.logo generated instead of placeholder (valid source, wrong for pinned role)", "ASSET_ROLE_POLICY")
def _(): s = example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["logo"]["assetSource"] = "generate-new"; return s


@mut("policy: customer.logo reused exactly", "ASSET_ROLE_POLICY")
def _(): s = example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["logo"]["assetSource"] = "reuse-exact"; return s


@mut("policy: customer.imagery reused exactly", "ASSET_ROLE_POLICY")
def _(): s = example(); node(s, "proof.testimonials")["content"]["slides"][0]["backdrop"]["assetSource"] = "reuse-exact"; return s


@mut("policy: team photo generated", "ASSET_ROLE_POLICY")
def _(): s = synth_spec("/company"); node(s, "features.team-ticker")["content"]["members"][0]["photo"]["assetSource"] = "generate-new"; return s


@mut("policy: author avatar reused exactly", "ASSET_ROLE_POLICY")
def _(): s = synth_spec("/blog"); node(s, "content.card-grid")["content"]["cards"][0]["author"] = {"name": "Sample", "role": "Role", "avatar": {"assetRole": "person.author-avatar", "assetSource": "reuse-exact", "alt": "a"}}; return s


@mut("policy: brand logo replaced by a placeholder (must-reuse-exact)", "ASSET_ROLE_POLICY")
def _(): s = example(); node(s, "shell.footer")["content"]["logo"]["assetSource"] = "placeholder"; return s


@mut("policy: og:image role switched to a generated image (must-reuse-exact owner asset)", "ASSET_ROLE_POLICY")
def _(): s = example(); s["meta"]["ogImage"]["assetSource"] = "generate-new"; return s


@mut("policy: valid role used in the wrong field", "ASSET_ROLE_POLICY")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetRole"] = "customer.logo"; node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetSource"] = "placeholder"; return s


@mut("policy: real customer name inside a must-not-fabricate asset alt", "PLACEHOLDER_ONLY_DENYLIST")
def _(): s = example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["logo"]["alt"] = "NAS Invest wordmark"; return s


@mut("policy: real testimonial person name", "PLACEHOLDER_ONLY_DENYLIST")
def _(): s = example(); node(s, "proof.testimonials")["content"]["slides"][0]["personName"] = "Janek Strobel"; return s


@mut("policy: real customer name in ticker alt text field", "PLACEHOLDER_ONLY_DENYLIST")
def _(): s = example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["alt"] = "SirPlus logo"; return s


@mut("links: internal path that is not a route", "LINK_TARGET_CLOSED")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][1]["ctas"][0]["to"] = "/experience-intelligence-2"; return s


@mut("links: mailto literal in a target field", "SCHEMA")
def _(): s = synth_spec("/contact"); node(s, "conversion.contact-form")["content"]["linkCards"][0]["to"] = "mailto:support@primefold.ai"; return s


def check_warn_cases():
    """Warn-severity rules must produce warnings, never errors (severity is honoured)."""
    res = []
    # NO_ADJACENT_SAME_CATEGORY: remove the named exception for the home FEATURES pair
    c = ctx_without_exception("NO_ADJACENT_SAME_CATEGORY", "template.home", ["features.how-it-works", "features.intelligence-cards"])
    errs, warns = run(example(), c)
    res.append(("warn: removing a named category exception yields a WARN not an error", not errs and any(w.startswith("NO_ADJACENT_SAME_CATEGORY") for w in warns)))
    # PAGE_HAS_HERO: remove the contact exception
    c = ctx_without_exception("PAGE_HAS_HERO", "template.contact")
    errs, warns = run(synth_spec("/contact"), c)
    res.append(("warn: hero-less template without exception yields WARN not error", not errs and any(w.startswith("PAGE_HAS_HERO") for w in warns)))
    # both directions: with the real exceptions the controls are silent
    errs, warns = run(example())
    res.append(("control: example has no warnings with real exceptions", not errs and not warns))
    return res


def main():
    fails, total = 0, 0

    def report(ok, name, extra=""):
        nonlocal fails, total
        total += 1
        if not ok:
            fails += 1
        print(("PASS " if ok else "FAIL ") + name + (f"  {extra}" if extra else ""))

    print("== controls ==")
    errs, warns = run(example())
    report(not errs, "control: bundled example (template.home)", "; ".join(errs[:3]))
    seen_templates = set()
    for path, r in CTX["routes"].items():
        spec = synth_spec(path)
        errs, warns = run(spec)
        seen_templates.add(r["template"])
        report(not errs, f"control: {path} -> {r['template']}", "; ".join(errs[:3]))
    report(seen_templates == set(CTX["templates"]), "controls cover every template", str(set(CTX["templates"]) - seen_templates))
    # RI state of plans (the comparison table must be absent)
    s = synth_spec("/plans"); s["nodes"] = [n for n in s["nodes"] if n["section"] != "features.comparison-table"]
    node(s, "hero.pricing")["content"] = synth_content(CTX["sections"]["hero.pricing"], "default", {"product": "RI"})
    errs, _ = run(s)
    report(not errs, "control: /plans in the RI state without comparison table", "; ".join(errs[:3]))

    print("== mutations (each must be REJECTED) ==")
    covered = set()
    for name, fn, expect in MUTATIONS:
        errs, _ = run(fn())
        ok = bool(errs) and any(e.startswith(expect) for e in errs)
        covered.add(expect)
        report(ok, name, f"expected {expect}; got {errs[:2]}" if not ok else "")

    print("== severity ==")
    for name, ok in check_warn_cases():
        report(ok, name)

    print("== coverage ==")
    err_rules = {rid for rid, r in CTX["graph"].items() if r["severity"] == "error"}
    missing = err_rules - covered
    report(not missing, "every error-severity graph rule has at least one rejecting mutation", str(sorted(missing)))
    warn_rules = {rid for rid, r in CTX["graph"].items() if r["severity"] == "warn"}
    report(warn_rules == {"NO_ADJACENT_SAME_CATEGORY", "PAGE_HAS_HERO"}, "warn rules are exactly the two covered by severity cases", str(sorted(warn_rules)))
    print(f"\n{total - fails}/{total} checks passed, {fails} failed")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
