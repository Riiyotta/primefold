#!/usr/bin/env python3
"""Semantic validator for Primefold PageSpecs.

Enforces what JSON Schema (schema/pagespec.schema.json) cannot express:
  * the declared template's real node list (required / order / repeatable), keyed on (section, variant)
  * route <-> template binding, route variant overrides (templates/routes.json)
  * rhythm and structure rules from compatibility/graph.json, honouring severity (error | warn)
  * per-instance maxWords budgets from the section contracts (sections/*.json)
  * closed asset-role policy, closed link targets, placeholder-only deny-list (assets/asset-roles.json)

Every rule id in compatibility/graph.json must be implemented here (RULES) and vice versa;
extraction/verify_all.py checks that both directions agree.

Usage:  python3 schema/semantic_validate.py <pagespec.json> [...]
The repo root is derived from this file's location, never from an absolute path.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return json.load(f)


def load_context(root=None):
    global ROOT
    if root:
        ROOT = root
    sections = {}
    sdir = os.path.join(ROOT, "sections")
    for fn in sorted(os.listdir(sdir)):
        if fn.endswith(".json"):
            s = _load(os.path.join("sections", fn))
            sections[s["id"]] = s
    templates = {t["id"]: t for t in _load("templates/templates.json")["templates"]}
    routes = {r["path"]: r for r in _load("templates/routes.json")["routes"]}
    graph = {r["id"]: r for r in _load("compatibility/graph.json")["rules"]}
    assets = _load("assets/asset-roles.json")
    return {
        "sections": sections, "templates": templates, "routes": routes, "graph": graph,
        "roles": {r["role"]: r for r in assets["assetRoles"]},
        "dests": {r["role"]: r for r in assets["destinationRoles"]},
        "endpoints": {r["role"]: r for r in assets["formEndpointRoles"]},
        "identities": assets["realIdentities"]["customers"] + assets["realIdentities"]["people"],
    }


def words(s):
    return len(str(s).split())


# ---------------------------------------------------------------- helpers
def walk_fields(fields, content, path, visit):
    """Walk a contract field map against an instance object. visit(kind, field, value, path)."""
    if not isinstance(content, dict):
        return
    for name, f in fields.items():
        if name not in content:
            continue
        walk_value(f, content[name], f"{path}.{name}", visit)


def walk_value(f, v, path, visit):
    t = f["type"]
    if t == "list":
        if isinstance(v, list):
            for i, item in enumerate(v):
                walk_value(f["item"], item, f"{path}[{i}]", visit)
        return
    if t == "object":
        walk_fields(f["fields"], v, path, visit)
        return
    visit(t, f, v, path)


def node_label(i, n):
    return f"nodes[{i}] {n.get('section')}/{n.get('variant')}"


# ---------------------------------------------------------------- rules (each returns a list of messages)
def r_route_template_match(ctx, spec):
    r = ctx["routes"].get(spec.get("route"))
    if r is None:
        return [f"route {spec.get('route')!r} is not in templates/routes.json"]
    if r["template"] != spec.get("template"):
        return [f"route {spec['route']} binds to {r['template']}, PageSpec declares {spec.get('template')}"]
    return []


def _tnodes(ctx, spec):
    return ctx["templates"][spec["template"]]["nodes"]


def r_template_node_match(ctx, spec):
    if spec.get("template") not in ctx["templates"]:
        return [f"unknown template {spec.get('template')!r}"]
    tn = _tnodes(ctx, spec)
    out, j, prev, prevk = [], 0, None, None
    for i, n in enumerate(spec.get("nodes", [])):
        s = n.get("section")
        if prev == s:
            if not tn[prevk].get("repeatable"):
                out.append(f"{node_label(i, n)} repeats a non-repeatable section")
            continue
        k = next((k for k in range(j, len(tn)) if tn[k]["section"] == s), None)
        if k is None:
            out.append(f"{node_label(i, n)} is not allowed here by {spec['template']} (extra section or out of order)")
            continue
        for sk in tn[j:k]:
            if sk["required"]:
                out.append(f"required section {sk['section']} missing before {node_label(i, n)}")
        j, prev, prevk = k + 1, s, k
    for sk in tn[j:]:
        if sk["required"]:
            out.append(f"required section {sk['section']} missing")
    return out


def r_navbar_first(ctx, spec):
    ns = spec.get("nodes", [])
    return [] if ns and ns[0].get("section") == "shell.navbar" else ["first node must be shell.navbar"]


def r_footer_last(ctx, spec):
    ns = spec.get("nodes", [])
    return [] if ns and ns[-1].get("section") == "shell.footer" else ["last node must be shell.footer"]


def r_cta_before_footer(ctx, spec):
    ns = spec.get("nodes", [])
    ok = len(ns) >= 2 and ns[-2].get("section") == "conversion.cta-band" and ns[-1].get("section") == "shell.footer"
    return [] if ok else ["conversion.cta-band must sit immediately before shell.footer"]


def r_one_per_page(ctx, spec):
    out, count = [], {}
    for n in spec.get("nodes", []):
        count[n.get("section")] = count.get(n.get("section"), 0) + 1
    for s, c in count.items():
        con = ctx["sections"].get(s, {}).get("constraints", {})
        if (con.get("onePerPage") or con.get("maxPerPage") == 1) and c > 1:
            out.append(f"{s} appears {c} times but is onePerPage")
    return out


def r_one_hero(ctx, spec):
    out = []
    ns = spec.get("nodes", [])
    idx = [i for i, n in enumerate(ns) if ctx["sections"].get(n.get("section"), {}).get("category") == "HERO"]
    if len(idx) > 1:
        out.append(f"{len(idx)} HERO sections on one page")
    if idx and idx[0] != 1:
        out.append(f"HERO section must directly follow the navbar (found at index {idx[0]})")
    return out


def r_page_has_hero(ctx, spec):
    ns = spec.get("nodes", [])
    if any(ctx["sections"].get(n.get("section"), {}).get("category") == "HERO" for n in ns):
        return []
    ex = {e["template"] for e in ctx["graph"]["PAGE_HAS_HERO"].get("exceptions", [])}
    return [] if spec.get("template") in ex else [f"{spec.get('template')} has no HERO section and is not a named exception"]


def r_section_template_restriction(ctx, spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        at = ctx["sections"].get(n.get("section"), {}).get("allowedTemplates", "any")
        if at != "any" and spec.get("template") not in at:
            out.append(f"{node_label(i, n)} is restricted to {at}")
    return out


def r_node_variant_allowed(ctx, spec):
    out = []
    if spec.get("template") not in ctx["templates"]:
        return out
    tn = {n["section"]: n for n in _tnodes(ctx, spec)}
    for i, n in enumerate(spec.get("nodes", [])):
        t = tn.get(n.get("section"))
        if t and t.get("variants") and n.get("variant") not in t["variants"]:
            out.append(f"{node_label(i, n)}: variant must be one of {t['variants']} for {spec['template']}")
    return out


def r_route_variant_override(ctx, spec):
    out = []
    r = ctx["routes"].get(spec.get("route"))
    if not r:
        return out
    for i, n in enumerate(spec.get("nodes", [])):
        want = r.get("variantOverrides", {}).get(n.get("section"))
        if want and n.get("variant") != want:
            out.append(f"{node_label(i, n)}: route {spec['route']} requires variant {want!r}")
    return out


def r_no_adjacent_same_section(ctx, spec):
    ns = spec.get("nodes", [])
    return [f"{node_label(i + 1, b)} repeats the previous (section, variant)" for i, (a, b) in enumerate(zip(ns, ns[1:]))
            if (a.get("section"), a.get("variant")) == (b.get("section"), b.get("variant"))]


def r_no_adjacent_same_category(ctx, spec):
    out = []
    ex = {(e["template"], e["pair"][0], e["pair"][1]) for e in ctx["graph"]["NO_ADJACENT_SAME_CATEGORY"].get("exceptions", [])}
    ns = spec.get("nodes", [])
    for a, b in zip(ns, ns[1:]):
        ca = ctx["sections"].get(a.get("section"), {}).get("category")
        cb = ctx["sections"].get(b.get("section"), {}).get("category")
        if ca and ca == cb and (spec.get("template"), a["section"], b["section"]) not in ex:
            out.append(f"{a['section']} then {b['section']} are both {ca} and not a named exception")
    return out


def r_plans_comparison_table_xi_only(ctx, spec):
    if spec.get("template") != "template.plans":
        return []
    ns = spec.get("nodes", [])
    hero = next((n for n in ns if n.get("section") == "hero.pricing"), None)
    has = any(n.get("section") == "features.comparison-table" for n in ns)
    if not hero:
        return []
    prod = hero.get("content", {}).get("product")
    if prod == "XI" and not has:
        return ["XI state requires features.comparison-table"]
    if prod == "RI" and has:
        return ["RI state must not include features.comparison-table"]
    return []


def r_section_conditional_rules(ctx, spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue
        content = n.get("content", {})
        for rule in sec.get("rules", []):
            w = rule["when"]
            if "variant" in w and n.get("variant") != w["variant"]:
                continue
            if "variantNot" in w and n.get("variant") == w["variantNot"]:
                continue
            if "field" in w and content.get(w["field"]) != w["equals"]:
                continue
            for k in rule.get("require", []):
                if k not in content:
                    out.append(f"{node_label(i, n)} [{rule['id']}] requires {k}")
            for k in rule.get("forbid", []):
                if k in content:
                    out.append(f"{node_label(i, n)} [{rule['id']}] forbids {k}")
            if "countField" in rule:
                got = len(content.get(rule["countField"], []))
                if got != rule["countEquals"]:
                    out.append(f"{node_label(i, n)} [{rule['id']}] {rule['countField']} must have {rule['countEquals']} items, has {got}")
    return out


def r_max_words(ctx, spec):
    out = []
    meta = spec.get("meta", {})
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "text" and isinstance(v, str) and words(v) > f["maxWords"]:
                out.append(f"{node_label(i, n)} {path}: {words(v)} words > maxWords {f['maxWords']}")
            elif kind == "link" and isinstance(v, dict) and words(v.get("label", "")) > f["labelMaxWords"]:
                out.append(f"{node_label(i, n)} {path}.label: {words(v['label'])} words > {f['labelMaxWords']}")
            elif kind == "asset" and isinstance(v, dict) and words(v.get("alt", "")) > 12:
                out.append(f"{node_label(i, n)} {path}.alt: more than 12 words")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def r_motion_pair(ctx, spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        m = n.get("motion")
        if not sec or not isinstance(m, dict):
            continue
        ok = any(m.get("pattern") == a["pattern"] and m.get("trigger") == a["trigger"] and m.get("reducedMotionFallback") == a["reducedMotionFallback"]
                 for a in sec["motion"]["allowed"])
        if not ok:
            out.append(f"{node_label(i, n)}: motion {m} is not an allowed (pattern, trigger, reducedMotionFallback) for this section")
        if not m.get("reducedMotionFallback"):
            out.append(f"{node_label(i, n)}: reducedMotionFallback is required")
    return out


def r_asset_role_policy(ctx, spec):
    out = []
    og = spec.get("meta", {}).get("ogImage")
    if isinstance(og, dict):
        role = ctx["roles"].get(og.get("assetRole"))
        if role is None or og.get("assetSource") not in role["allowedAssetSources"]:
            out.append(f"meta.ogImage: role {og.get('assetRole')!r} with source {og.get('assetSource')!r} violates the pinned policy")
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "form" and isinstance(v, dict):
                r = ctx["endpoints"].get(v.get("endpointRole"))
                if not r or v.get("endpointRole") != f["endpointRole"]:
                    out.append(f"{node_label(i, n)} {path}: endpointRole must be {f['endpointRole']}")
                if v.get("endpoint") != "project-owned-placeholder":
                    out.append(f"{node_label(i, n)} {path}: endpoint must be 'project-owned-placeholder' (policy {r['generationPolicy'] if r else '?'})")
            if kind != "asset" or not isinstance(v, dict):
                return
            role = ctx["roles"].get(v.get("assetRole"))
            if role is None:
                out.append(f"{node_label(i, n)} {path}: unknown assetRole {v.get('assetRole')!r}")
                return
            if v["assetRole"] not in f["roles"]:
                out.append(f"{node_label(i, n)} {path}: role {v['assetRole']} not allowed in this field (allowed {f['roles']})")
            if v.get("assetSource") not in role["allowedAssetSources"]:
                out.append(f"{node_label(i, n)} {path}: role {v['assetRole']} has policy {role['generationPolicy']}; assetSource {v.get('assetSource')!r} not allowed (allowed {role['allowedAssetSources']})")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def _check_target(ctx, t):
    if not isinstance(t, str):
        return "target must be a string"
    if t.startswith("dest:"):
        return None if t in ctx["dests"] else f"unknown destination role {t}"
    if t.startswith("#"):
        return None
    if t.startswith("/"):
        base = re.split(r"[#?]", t, 1)[0] or "/"
        if base in ctx["routes"] or base.rstrip("/") in ctx["routes"]:
            return None
        return f"internal path {base} is not a route in templates/routes.json"
    return f"target {t!r} is not a route, anchor or dest:<role> (literal URLs are forbidden)"


def r_link_target_closed(ctx, spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "target":
                e = _check_target(ctx, v)
            elif kind == "link" and isinstance(v, dict):
                e = _check_target(ctx, v.get("to"))
            else:
                return
            if e:
                out.append(f"{node_label(i, n)} {path}: {e}")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def r_placeholder_only_denylist(ctx, spec):
    out = []
    pats = [(x, re.compile(r"(?<!\w)" + re.escape(x) + r"(?!\w)", re.I)) for x in ctx["identities"]]
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            texts = []
            if kind == "text" and f.get("placeholderOnly") and isinstance(v, str):
                texts.append(v)
            if kind == "asset" and isinstance(v, dict):
                role = ctx["roles"].get(v.get("assetRole"))
                if role and role["generationPolicy"] == "must-not-fabricate" and isinstance(v.get("alt"), str):
                    texts.append(v["alt"])
            for t in texts:
                for name, p in pats:
                    if p.search(t):
                        out.append(f"{node_label(i, n)} {path}: contains real identity {name!r}")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


RULES = {
    "NAVBAR_FIRST": r_navbar_first,
    "FOOTER_LAST": r_footer_last,
    "CTA_BEFORE_FOOTER": r_cta_before_footer,
    "ONE_PER_PAGE": r_one_per_page,
    "ONE_HERO": r_one_hero,
    "PAGE_HAS_HERO": r_page_has_hero,
    "SECTION_TEMPLATE_RESTRICTION": r_section_template_restriction,
    "NODE_VARIANT_ALLOWED": r_node_variant_allowed,
    "ROUTE_VARIANT_OVERRIDE": r_route_variant_override,
    "TEMPLATE_NODE_MATCH": r_template_node_match,
    "ROUTE_TEMPLATE_MATCH": r_route_template_match,
    "NO_ADJACENT_SAME_SECTION": r_no_adjacent_same_section,
    "NO_ADJACENT_SAME_CATEGORY": r_no_adjacent_same_category,
    "PLANS_COMPARISON_TABLE_XI_ONLY": r_plans_comparison_table_xi_only,
    "SECTION_CONDITIONAL_RULES": r_section_conditional_rules,
    "MAX_WORDS": r_max_words,
    "MOTION_PAIR": r_motion_pair,
    "ASSET_ROLE_POLICY": r_asset_role_policy,
    "LINK_TARGET_CLOSED": r_link_target_closed,
    "PLACEHOLDER_ONLY_DENYLIST": r_placeholder_only_denylist,
}
IMPLEMENTED_RULES = set(RULES)


def validate_semantic(spec, ctx=None):
    """Return (errors, warnings); each entry is 'RULE_ID: message'. Severity comes from compatibility/graph.json."""
    ctx = ctx or load_context()
    errors, warnings = [], []
    for rid, fn in RULES.items():
        sev = ctx["graph"][rid]["severity"]
        try:
            msgs = fn(ctx, spec)
        except (KeyError, TypeError, AttributeError) as e:  # malformed instance: report, never crash
            msgs = [f"validator could not evaluate rule on malformed instance ({type(e).__name__}: {e})"]
        for m in msgs:
            (errors if sev == "error" else warnings).append(f"{rid}: {m}")
    return errors, warnings


def validate_schema(spec):
    from jsonschema import Draft7Validator
    schema = _load("schema/pagespec.schema.json")
    v = Draft7Validator(schema)
    return [f"SCHEMA: {'/'.join(str(p) for p in e.absolute_path) or '<root>'}: {e.message[:200]}" for e in sorted(v.iter_errors(spec), key=lambda e: list(e.absolute_path))]


def validate_all(spec, ctx=None):
    """Schema first; semantic rules only when the instance is structurally sound enough to walk."""
    se = validate_schema(spec)
    errors, warnings = validate_semantic(spec, ctx)
    return se + errors, warnings


def main(argv):
    if not argv:
        argv = [os.path.join(ROOT, "schema", "example.pagespec.json")]
    ctx = load_context()
    bad = 0
    for p in argv:
        with open(p, encoding="utf-8") as f:
            spec = json.load(f)
        errs, warns = validate_all(spec, ctx)
        print(f"{os.path.basename(p)}: {len(errs)} error(s), {len(warns)} warning(s)")
        for e in errs:
            print("  ERROR", e)
        for w in warns:
            print("  WARN ", w)
        bad += len(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
