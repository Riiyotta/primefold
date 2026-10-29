#!/usr/bin/env python3
"""Adversarial suite: proves every rule rejects a bad instance, and every real template passes.

Controls   : one valid PageSpec is auto-synthesised from EVERY route's template node list (plus the bundled
             example), so adding a template to templates/templates.json is covered with zero new code.
Mutations  : hand-written negatives for schema rules, structure/rhythm rules, runtime (maxWords) and the
             pinned asset policies (including different-but-still-valid values, which a plain enum check
             cannot catch). A coverage check fails if a graph rule has no mutation.

Generation mode: every GENERATION_MODE_* rule has rejecting mutations (Primefold logo / wordmark / badges / site icons in
another brand's page, unsupported branded roles, source-file assetRefs, brand names incl. zero-width / case disguises,
CTA, people, customers, copy shingles, claims, URLs, embeds, screenshots); the generation examples are the controls, and
the clone example with real Primefold assets and copy must still pass (clone mode keeps validating real content).
Also: TOKEN_* mutations, retrieval-eligibility mutations (contract / generation node), registry-only availability edits
(pins must still reject), and wrapper-gate cases over the measured heights.

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
VERSION = json.load(open(os.path.join(ROOT, "schema", "pagespec.schema.json")))["properties"]["pageSpecVersion"]["const"]


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
        return {"assetRole": role["role"], "assetSource": role["cloneAssetSources"][0], "alt": "Alt text"}
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
    return {"pageSpecVersion": VERSION, "mode": "clone", "template": tpl["id"], "route": route_path,
            "meta": {"title": "Synthesised control", "description": "Auto-built from the template node list."}, "nodes": nodes}


def run(spec, ctx=None):
    return sv.validate_all(spec, ctx or CTX)


# ---------------------------------------------------------------- helpers for mutations
def node(spec, section):
    return next(n for n in spec["nodes"] if n["section"] == section)


def example():
    with open(os.path.join(ROOT, "schema", "example.pagespec.json"), encoding="utf-8") as f:
        return json.load(f)


def gen_example(fam="home"):
    with open(os.path.join(ROOT, "schema", "examples", f"generated.{fam}.pagespec.json"), encoding="utf-8") as f:
        return json.load(f)


def ctx_from_copy(edit):
    """Load a validator context from a scratch copy of the repo whose files were edited by edit(root)."""
    import shutil
    import tempfile
    d = tempfile.mkdtemp(prefix="adv-ctx-")
    try:
        r = os.path.join(d, "design-repo")
        shutil.copytree(ROOT, r, ignore=shutil.ignore_patterns("__pycache__"))
        edit(r)
        c = sv.load_context(r)
    finally:
        sv.load_context(ROOT)  # restore the module root
        shutil.rmtree(d, ignore_errors=True)
    return c


def edit_json(root, rel, fn):
    p = os.path.join(root, rel)
    d = json.load(open(p, encoding="utf-8"))
    fn(d)
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)


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


@mut("schema: mode missing", "SCHEMA")
def _(): s = example(); del s["mode"]; return s


@mut("schema: mode outside the closed enum (reference)", "SCHEMA")
def _(): s = example(); s["mode"] = "reference"; return s


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


@mut("schema: unknown styleTokens slot", "SCHEMA")
def _(): s = example(); node(s, "proof.trust")["styleTokens"] = {"color": "text.primary"}; return s


@mut("schema: theme that does not exist (dark)", "SCHEMA")
def _(): s = example(); s["theme"] = "dark"; return s


@mut("schema: non-placeholder https URL as a link target", "SCHEMA")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["button"]["to"] = "https://larkspur.com/start"; return s


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
def _(): s = synth_spec("/imprint"); node(s, "content.legal-header")["variant"] = "terms-of-service"; return s


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


@mut("policy: field that is exactly a real first name", "PLACEHOLDER_ONLY_DENYLIST")
def _(): s = example(); node(s, "proof.testimonials")["content"]["slides"][0]["personName"] = "Sarah"; return s


@mut("policy: real customer name in ticker alt text field", "PLACEHOLDER_ONLY_DENYLIST")
def _(): s = example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["alt"] = "SirPlus logo"; return s


@mut("links: internal path that is not a route", "LINK_TARGET_CLOSED")
def _(): s = example(); node(s, "hero.home-carousel")["content"]["slides"][1]["ctas"][0]["to"] = "/experience-intelligence-2"; return s


@mut("links: mailto literal in a target field", "SCHEMA")
def _(): s = synth_spec("/contact"); node(s, "conversion.contact-form")["content"]["linkCards"][0]["to"] = "mailto:support@primefold.ai"; return s


# ---- generation mode (review items 1-7): Primefold identity in a page for another brand
def _gen_node(s, section):
    return node(s, section)


@mut("GEN: Primefold logo (brand.logo-mark, reuse-exact) in another brand's footer", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "shell.footer")["content"]["logo"] = {"assetRole": "brand.logo-mark", "assetSource": "reuse-exact", "alt": "Logo"}; return s


@mut("GEN: Primefold logo role even with a placeholder source (role is clone-only)", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "shell.footer")["content"]["logo"] = {"assetRole": "brand.logo-mark", "assetSource": "placeholder", "alt": "Logo"}; return s


@mut("GEN: Primefold wordmark in another brand's footer", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "shell.footer")["content"]["wordmark"] = {"assetRole": "brand.wordmark-ghost", "assetSource": "reuse-exact", "alt": ""}; return s


@mut("GEN: Primefold product badge (XI/RI) on another brand's hero tab", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["tabs"][1]["icon"] = {"assetRole": "brand.product-badge", "assetSource": "reuse-exact", "alt": "XI badge"}; return s


@mut("GEN: Primefold XI badge selected on another brand's pricing hero (plans)", "GENERATION_MODE_ASSET")
def _(): s = gen_example("plans"); node(s, "hero.pricing")["content"]["product"] = "XI"; return s


@mut("GEN: Primefold RI badge on another brand's testimonial", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "proof.testimonials")["content"]["slides"][0]["product"] = "RI"; return s


@mut("GEN: Primefold xi badge pill on another brand's case study", "GENERATION_MODE_ASSET")
def _(): s = gen_example("case-study"); node(s, "content.case-study-header")["content"]["pills"][0]["badge"] = "xi"; return s


@mut("GEN: Primefold site icon as og:image", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); s["meta"]["ogImage"] = {"assetRole": "brand.site-icons", "assetSource": "reuse-exact", "alt": "Social preview"}; return s


@mut("GEN: unsupported branded asset role (invented 'brand.primefold-badge')", "SCHEMA")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["tabs"][1]["icon"]["assetRole"] = "brand.primefold-badge"; return s


@mut("GEN: generation-safe slot but assetRef points at a Primefold source file", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetRef"] = "public/assets/RAjs2AsxMPYWQK7qgQzwPegjUEI.webp"; return s


@mut("GEN: Primefold logo file smuggled under a generated: prefix", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "shell.footer")["content"]["logo"]["assetRef"] = "generated:0ngLiiCSe7c81sENFiXDCxUe8Ew.svg"; return s


@mut("GEN: Primefold owner artwork reused exactly (hero backdrop reuse-exact)", "GENERATION_MODE_ASSET")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"]["assetSource"] = "reuse-exact"; return s


@mut("GEN: real Primefold product screenshot referenced as a product still", "GENERATION_MODE_SCREENSHOT")
def _(): s = gen_example(); node(s, "features.how-it-works")["content"]["backdrop"]["assetRef"] = "generated:6SGxSZ97zxsJhQI7QRmEcVF3QE.jpg"; return s


@mut("GEN: brand name in a heading", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["slides"][0]["title"] = "Primefold for finance teams"; return s


@mut("GEN: brand name disguised with a zero-width space", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["slides"][0]["title"] = "Prime​fold for finance"; return s


@mut("GEN: brand name in capitals inside meta.title", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); s["meta"]["title"] = "PRIMEFOLD alternative"; return s


@mut("GEN: product name (Real Estate Intelligence) in body copy", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["slides"][0]["body"] = "Our Real Estate Intelligence for ledgers."; return s


@mut("GEN: product short name XI as a tab label", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); node(s, "hero.home-carousel")["content"]["tabs"][1]["label"] = "XI"; return s


@mut("GEN: source CTA string (Try Primefold XI) as a link label", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["button"]["label"] = "Try Primefold XI"; return s


@mut("GEN: brand.name set to Primefold", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); s["brand"]["name"] = "Primefold"; return s


@mut("GEN: brand object missing", "GENERATION_MODE_BRAND")
def _(): s = gen_example(); del s["brand"]; return s


@mut("GEN: brand leaks through a new post slug", "GENERATION_MODE_BRAND")
def _(): s = gen_example("blog-post"); s["route"] = "/blog/why-we-left-primefold"; return s


@mut("GEN: real testimonial person name", "GENERATION_MODE_PERSON")
def _(): s = gen_example(); node(s, "proof.testimonials")["content"]["slides"][0]["personName"] = "Janek Strobel"; return s


@mut("GEN: real team first name as a member name", "GENERATION_MODE_PERSON")
def _(): s = gen_example("company"); node(s, "features.team-ticker")["content"]["members"][0]["name"] = "Vlatko"; return s


@mut("GEN: real team photo role", "GENERATION_MODE_PERSON")
def _(): s = gen_example("company"); node(s, "features.team-ticker")["content"]["members"][0]["photo"] = {"assetRole": "person.team-photo", "assetSource": "placeholder", "alt": "Team member"}; return s


@mut("GEN: real author avatar role on a post", "GENERATION_MODE_PERSON")
def _():
    s = gen_example("blog-post"); h = node(s, "content.article-header")["content"]
    h["author"] = {"name": "Mara Ellison", "role": "Controller", "avatar": {"assetRole": "person.author-avatar", "assetSource": "placeholder", "alt": "Author"}}; return s


@mut("GEN: real customer name in copy", "GENERATION_MODE_CUSTOMER")
def _(): s = gen_example(); node(s, "proof.outcomes")["content"]["lead"] = "Trusted by SirPlus and others."; return s


@mut("GEN: real customer logo role in the ticker", "GENERATION_MODE_CUSTOMER")
def _(): s = gen_example(); node(s, "proof.logo-ticker")["content"]["logos"][0]["logo"] = {"assetRole": "customer.logo", "assetSource": "placeholder", "alt": "Logo"}; return s


@mut("GEN: real customer imagery role behind a testimonial", "GENERATION_MODE_CUSTOMER")
def _(): s = gen_example(); node(s, "proof.testimonials")["content"]["slides"][0]["backdrop"] = {"assetRole": "customer.imagery", "assetSource": "placeholder", "alt": "Backdrop"}; return s


@mut("GEN: Primefold source copy reused verbatim", "GENERATION_MODE_COPY")
def _(): s = gen_example(); node(s, "features.how-it-works")["content"]["title"] = "How a question becomes a next move."; return s


@mut("GEN: source copy disguised with curly quotes, em dash and odd spacing", "GENERATION_MODE_COPY")
def _(): s = gen_example(); node(s, "features.how-it-works")["content"]["title"] = "How  a question — becomes a next  move"; return s


@mut("GEN: source outcome claim reused (150 customers)", "GENERATION_MODE_CLAIM")
def _(): s = gen_example(); node(s, "proof.outcomes")["content"]["lead"] = "Over 150 customers switched."; return s


@mut("GEN: source case-study statistic reused (+76%)", "GENERATION_MODE_CLAIM")
def _(): s = gen_example("case-study"); node(s, "proof.case-study-stats")["content"]["stats"][0]["value"] = "+76%"; return s


@mut("GEN: live booking URL pasted into copy", "GENERATION_MODE_URL")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["body"] = "Book at calendly.com/d/dv3b-wwt-mfy"; return s


@mut("GEN: non-placeholder domain in copy", "GENERATION_MODE_URL")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["body"] = "Visit larkspur.com today"; return s


@mut("GEN: Primefold support e-mail in copy", "GENERATION_MODE_URL")
def _(): s = gen_example("contact"); node(s, "conversion.contact-form")["content"]["lead"] = "Write to support@primefold.ai"; return s


@mut("GEN: link to the Primefold XI help centre (blocked destination role)", "GENERATION_MODE_URL")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["button"]["to"] = "dest:help-center-xi"; return s


@mut("GEN: link to a real client website destination", "GENERATION_MODE_URL")
def _(): s = gen_example(); node(s, "conversion.cta-band")["content"]["button"]["to"] = "dest:client-website"; return s


@mut("GEN: third-party video embed role in a post body", "GENERATION_MODE_EMBED")
def _():
    s = gen_example("blog-post"); b = node(s, "content.article-body")["content"]["blocks"]
    b.append({"type": "video", "image": {"assetRole": "embed.video-facade", "assetSource": "placeholder", "alt": "Video"}}); return s


@mut("GEN: YouTube host referenced in copy", "GENERATION_MODE_EMBED")
def _(): s = gen_example("blog-post"); node(s, "content.article-body")["content"]["blocks"][0]["text"] = "Watch it on youtube.com"; return s


@mut("GEN: clone example relabelled as generation (rules key on mode)", "GENERATION_MODE_ASSET")
def _(): s = example(); s["mode"] = "generation"; s["brand"] = {"name": "Larkspur"}; return s


@mut("GEN: spec-only (retrieval-ineligible) section used in generation mode", "RETRIEVAL_ELIGIBILITY")
def _(): s = synth_spec("/experience-intelligence"); s["mode"] = "generation"; s["brand"] = {"name": "Larkspur"}; return s


# ---- style tokens
def _tokspec(st, mode="clone", theme=None):
    s = gen_example() if mode == "generation" else example()
    if theme:
        s["theme"] = theme
    node(s, "proof.trust")["styleTokens"] = st
    return s


@mut("TOKEN: unknown token path", "TOKEN_UNKNOWN")
def _(): return _tokspec({"surface": "surface.neon"})


@mut("TOKEN: raw hex colour", "TOKEN_RAW_VALUE")
def _(): return _tokspec({"surface": "#ff0000"})


@mut("TOKEN: raw rgb() colour", "TOKEN_RAW_VALUE")
def _(): return _tokspec({"text": "rgb(10, 10, 10)"})


@mut("TOKEN: arbitrary spacing in px", "TOKEN_ARBITRARY_SPACING")
def _(): return _tokspec({"spacingTop": "37px"})


@mut("TOKEN: arbitrary spacing step that is not on the scale", "TOKEN_ARBITRARY_SPACING")
def _(): return _tokspec({"gap": "spacing.37"})


@mut("TOKEN: unsupported font family literal", "TOKEN_UNSUPPORTED_FONT")
def _(): return _tokspec({"headingFont": "Comic Sans MS, cursive"})


@mut("TOKEN: trial-licensed font in generation mode", "TOKEN_UNSUPPORTED_FONT")
def _(): return _tokspec({"headingFont": "fontFamily.favorit"}, mode="generation")


@mut("TOKEN: valid token in the wrong slot category", "TOKEN_SLOT_CATEGORY")
def _(): return _tokspec({"surface": "text.primary"})


@mut("TOKEN: invalid theme/token combination (inverse text on a light surface)", "TOKEN_THEME_COMBINATION")
def _(): return _tokspec({"surface": "surface.page", "text": "text.inverse"})


@mut("TOKEN: invalid theme/token combination (dark-surface text on the stat card)", "TOKEN_THEME_COMBINATION")
def _(): return _tokspec({"surface": "surface.stat", "text": "text.on-black-button"})


def registry_cases():
    """Editing the registry alone must not loosen anything: the code pins still reject."""
    res = []
    c = ctx_from_copy(lambda r: edit_json(r, "assets/asset-roles.json", lambda d: [x.update({"availability": "generation-safe", "generationAssetSources": ["reuse-exact"]}) for x in d["roles"] if x["role"] == "brand.logo-mark"]))
    s = gen_example(); node(s, "shell.footer")["content"]["logo"] = {"assetRole": "brand.logo-mark", "assetSource": "reuse-exact", "alt": "Logo"}
    errs, _ = run(s, c)
    res.append(("pin: registry flips brand.logo-mark to generation-safe -> still rejected (ASSET_ROLE_POLICY pin violation + GENERATION_MODE_ASSET reuse)",
                any("pin violation" in e for e in errs) and any(e.startswith("GENERATION_MODE_ASSET") for e in errs)))
    c = ctx_from_copy(lambda r: edit_json(r, "assets/asset-roles.json", lambda d: [x.update({"clonePolicy": "may-generate-new", "cloneAssetSources": ["generate-new", "placeholder"]}) for x in d["roles"] if x["role"] == "customer.logo"]))
    errs, _ = run(example(), c)
    res.append(("pin: registry moves customer.logo to a different-but-valid clone policy -> every validation fails", any("pin violation" in e for e in errs)))
    c = ctx_from_copy(lambda r: edit_json(r, "sections/features.sources.json", lambda d: d.update({"retrievalEligible": True}) or d.pop("retrievalReason", None)))
    errs, _ = run(example(), c)
    res.append(("retrieval: spec-only contract flipped to eligible -> RETRIEVAL_ELIGIBILITY", any(e.startswith("RETRIEVAL_ELIGIBILITY") for e in errs)))
    c = ctx_from_copy(lambda r: edit_json(r, "sections/proof.trust.json", lambda d: d.update({"retrievalEligible": False, "retrievalReason": "x" * 40})))
    errs, _ = run(example(), c)
    res.append(("retrieval: content section marked ineligible -> RETRIEVAL_ELIGIBILITY", any(e.startswith("RETRIEVAL_ELIGIBILITY") for e in errs)))
    c = ctx_from_copy(lambda r: os.remove(os.path.join(r, "schema", "source-patterns.json")))
    errs, _ = run(gen_example(), c)
    res.append(("patterns: generation mode fails closed when schema/source-patterns.json is missing", any("source-patterns.json is missing" in e for e in errs)))
    return res


def gate_cases():
    sys.path.insert(0, os.path.join(ROOT, "extraction"))
    import wrapper_gate as wg
    sh0, T, R, S_ = wg.load_inputs()
    res = []

    def ev(mut_fn):
        sh = copy.deepcopy(sh0)
        mut_fn(sh)
        return wg.evaluate(sh, T, R, S_)

    def hero(sh, h):
        n = next(n for n in sh["routes"]["/security"]["nodes"] if n["section"] == "hero.security-comet")
        n["heightPx"] = h
        sh["routes"]["/security"]["pageHeight"] = 20000
    e, w, _ = ev(lambda sh: hero(sh, 1900))
    res.append(("gate: HERO 1900px warns, does not fail", not e and any("HERO" in x for x in w)))
    e, w, _ = ev(lambda sh: hero(sh, 3100))
    res.append(("gate: HERO 3100px fails", any("HERO" in x for x in e)))

    def share(sh):
        n = next(n for n in sh["routes"]["/plans"]["nodes"] if n["section"] == "features.comparison-table")
        n["heightPx"] = int(sh["routes"]["/plans"]["pageHeight"] * 0.65)
    e, w, _ = ev(share)
    res.append(("gate: one section holding 65% of a page fails", any("holds" in x for x in e)))

    def share_wl(sh, just, who="design-repo agent (agent attestation, not a human sign-off)"):
        share(sh)
        sh["whitelist"] = [{"route": "/plans", "section": "features.comparison-table", "maxHeightPx": 999999, "justification": just, "reviewedBy": who}]
    e, w, _ = ev(lambda sh: share_wl(sh, "Comparison matrix is one table by design; reviewed in this pass."))
    res.append(("gate: whitelisted majority section passes but still warns", not e and any("whitelisted" in x for x in w)))
    e, w, _ = ev(lambda sh: share_wl(sh, "ok"))
    res.append(("gate: whitelist entry without a 30+ char justification fails", any("justification" in x for x in e)))
    e, w, _ = ev(lambda sh: share_wl(sh, "Comparison matrix is one table by design; reviewed in this pass.", who="review agent"))
    res.append(("gate: agent reviewer without 'agent attestation, not a human sign-off' fails", any("agent attestation" in x for x in e)))
    e, w, _ = ev(lambda sh: sh["routes"].pop("/plans"))
    res.append(("gate: missing measurement fails", any("missing measurement" in x for x in e)))
    e, w, _ = ev(lambda sh: sh.update({"viewport": 1280}))
    res.append(("gate: measurement at the wrong viewport fails", any("viewport" in x for x in e)))
    e, w, _ = ev(lambda sh: sh.update({"whitelist": [{"route": "/", "section": "proof.outcomes", "maxHeightPx": 5000, "justification": "x" * 40, "reviewedBy": "someone"}]}))
    res.append(("gate: stale whitelist entry fails", any("stale" in x for x in e)))
    e, w, _ = ev(lambda sh: None)
    res.append(("gate control: real measurements pass with 0 errors", not e))
    return res


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

    s = example(); node(s, "proof.testimonials")["content"]["slides"][0]["personName"] = "Sarah Placeholder"
    errs, _ = run(s)
    report(not any("real first name" in e or "real identity" in e for e in errs), "control: common first name inside longer placeholder text is not rejected", "; ".join(errs[:3]))

    import glob
    gens = sorted(glob.glob(os.path.join(ROOT, "schema", "examples", "generated.*.pagespec.json")))
    for p in gens:
        e = json.load(open(p, encoding="utf-8"))
        errs, warns = run(e)
        report(not errs and not warns and e["mode"] == "generation", f"control: generation example {os.path.basename(p)}", "; ".join(errs[:3]))
    report(len(gens) >= 12, f"controls: {len(gens)} generation examples present (one per renderable template)")
    s = example()
    real_logo = node(s, "shell.footer")["content"]["logo"]
    report(s["mode"] == "clone" and real_logo["assetRole"] == "brand.logo-mark" and real_logo["assetSource"] == "reuse-exact" and not run(s)[0],
           "control: clone example still validates with the REAL Primefold logo (reuse-exact) and real copy")
    s = example(); node(s, "hero.home-carousel")["content"]["slides"][0]["background"].update({"assetSource": "reuse-exact", "assetRef": "public/assets/RAjs2AsxMPYWQK7qgQzwPegjUEI.webp"})
    errs, _ = run(s)
    report(not errs, "control: clone mode may reuse Primefold owner artwork for fidelity (hero backdrop reuse-exact + real assetRef)", "; ".join(errs[:2]))
    s = example(); node(s, "proof.trust")["styleTokens"] = {"surface": "surface.inverse", "text": "text.inverse", "spacingTop": "layout.section-pad-title", "radius": "radius.lg", "headingFont": "fontFamily.favorit"}
    errs, _ = run(s)
    report(not errs, "control: valid styleTokens (incl. the trial font) pass in clone mode", "; ".join(errs[:2]))
    s = gen_example(); s["route"] = "/"; node(s, "conversion.cta-band")["content"]["button"] = {"label": "Help", "to": "https://help.larkspur.example/start"}
    errs, _ = run(s)
    report(not errs, "control: reserved .example placeholder URL passes in generation mode", "; ".join(errs[:2]))

    print("== mutations (each must be REJECTED) ==")
    covered = set()
    for name, fn, expect in MUTATIONS:
        errs, _ = run(fn())
        ok = bool(errs) and any(e.startswith(expect) for e in errs)
        covered.add(expect)
        report(ok, name, f"expected {expect}; got {errs[:2]}" if not ok else "")

    print("== registry-only edits / retrieval ==")
    for name, ok_ in registry_cases():
        report(ok_, name)
        if "RETRIEVAL_ELIGIBILITY" in name:
            covered.add("RETRIEVAL_ELIGIBILITY")

    print("== wrapper gate ==")
    for name, ok_ in gate_cases():
        report(ok_, name)

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
