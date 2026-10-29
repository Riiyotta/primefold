#!/usr/bin/env python3
"""Semantic validator for Primefold PageSpecs (pageSpecVersion 1.1.0).

Enforces what JSON Schema (schema/pagespec.schema.json) cannot express:
  * the declared template's real node list (required / order / repeatable), keyed on (section, variant)
  * route <-> template binding, route variant overrides (templates/routes.json)
  * rhythm and structure rules from compatibility/graph.json, honouring severity (error | warn)
  * per-instance maxWords budgets from the section contracts (sections/*.json)
  * MODE: 'clone' (faithful Primefold reconstruction: Primefold-owned assets may be reused) vs 'generation' (a page for
    another brand). Generation mode rejects Primefold identity and content, one named rule per category:
    GENERATION_MODE_BRAND / _ASSET / _PERSON / _CUSTOMER / _SCREENSHOT / _COPY / _CLAIM / _URL / _EMBED.
    Patterns come from schema/source-patterns.json (built from the real source by extraction/build_source_patterns.py).
  * asset availability (clone-only | generation-safe | blocked-for-generation) and clone policies, PINNED IN CODE below
    (PINNED_AVAILABILITY / PINNED_POLICIES); a registry that disagrees with the pins makes every validation fail.
  * retrieval eligibility pinned in code (RETRIEVAL_INELIGIBLE)
  * style tokens (TOKEN_*): unknown token, raw values, arbitrary spacing, unsupported font, slot category, theme combination

Every rule id in compatibility/graph.json must be implemented here (RULES) and vice versa;
extraction/verify_all.py checks that both directions agree. Detection is string-based (verbatim / lightly disguised
reuse after normalisation); it cannot detect paraphrase.

Usage:  python3 schema/semantic_validate.py <pagespec.json> [...]
The repo root is derived from this file's location, never from an absolute path.
"""
import hashlib
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- pins (independent of the registry files)
# Availability of EVERY role. Editing assets/asset-roles.json alone cannot loosen this: a mismatch fails every validation
# (and extraction/verify_all.py, which carries its own copy of this table).
PINNED_AVAILABILITY = {
    "brand.logo-mark": "clone-only", "brand.wordmark-ghost": "clone-only", "brand.product-badge": "clone-only", "brand.site-icons": "clone-only",
    "customer.logo": "blocked-for-generation", "customer.imagery": "blocked-for-generation",
    "person.team-photo": "blocked-for-generation", "person.author-avatar": "blocked-for-generation",
    "embed.video-facade": "blocked-for-generation",
    "dest:help-center-xi": "blocked-for-generation", "dest:help-center-ri": "blocked-for-generation", "dest:client-website": "blocked-for-generation",
    "ui.icon-mask": "generation-safe", "ui.illustration-svg": "generation-safe", "fx.shader-fallback": "generation-safe",
    "hero.backdrop-photo": "generation-safe", "photo.scene-card": "generation-safe", "product.illustration-still": "generation-safe",
    "cms.post-image": "generation-safe", "motion.lottie": "generation-safe",
    "brand.placeholder-mark": "generation-safe", "brand.user-supplied-mark": "generation-safe", "asset.user-supplied": "generation-safe",
    "generated.illustration": "generation-safe", "placeholder.screenshot": "generation-safe", "fictional.person-avatar": "generation-safe",
    "placeholder.company-logo": "generation-safe", "url.placeholder": "generation-safe", "copy.original": "generation-safe",
    "dest:booking": "generation-safe", "dest:app-signin": "generation-safe", "dest:app-trial": "generation-safe", "dest:app-home": "generation-safe",
    "dest:job-posting": "generation-safe", "dest:social-x": "generation-safe", "dest:social-linkedin": "generation-safe", "dest:support-mailto": "generation-safe",
    "endpoint.contact-form": "generation-safe", "endpoint.newsletter-form": "generation-safe",
}
# Clone-mode policies of the weighty roles (a different-but-valid value is still a violation).
PINNED_POLICIES = {
    "customer.logo": "must-not-fabricate", "customer.imagery": "must-not-fabricate", "person.team-photo": "must-not-fabricate",
    "person.author-avatar": "must-not-fabricate", "embed.video-facade": "must-not-fabricate",
    "brand.logo-mark": "must-reuse-exact", "brand.wordmark-ghost": "must-reuse-exact", "brand.product-badge": "must-reuse-exact", "brand.site-icons": "must-reuse-exact",
    "endpoint.contact-form": "must-not-reuse-live-endpoint", "endpoint.newsletter-form": "must-not-reuse-live-endpoint",
}
POLICY_SOURCES = {"must-reuse-exact": ["reuse-exact"], "may-reuse-or-generate": ["reuse-exact", "generate-new", "placeholder"],
                  "may-generate-new": ["generate-new", "placeholder"], "must-not-fabricate": ["placeholder"], "placeholder-only": ["placeholder"],
                  "user-supplied-only": ["user-supplied"], "must-not-reuse-live-endpoint": []}
# Which named rule rejects a non-generation-safe role in mode 'generation'.
GENERATION_RULE_FOR_ROLE = {"brand.": "GENERATION_MODE_ASSET", "customer.": "GENERATION_MODE_CUSTOMER", "person.": "GENERATION_MODE_PERSON",
                            "embed.": "GENERATION_MODE_EMBED", "dest:": "GENERATION_MODE_URL"}
# Sections that are not retrievable as proven patterns (spec-only product sections; the product routes render a placeholder).
RETRIEVAL_INELIGIBLE = {"features.loop-cards", "features.solutions-tabs", "features.sources", "features.step-cards", "features.use-cases", "hero.product-live-chat"}
RUNTIME_UI_RE = re.compile(r"cookie|consent|modal|dialog|drawer|popup|pop-up|overlay|preloader|toast|lightbox", re.I)
PLACEHOLDER_URL_RE = re.compile(r"^https://([a-z0-9-]+\.)*[a-z0-9-]+\.(example|invalid)(/[A-Za-z0-9/._~#-]*)?$")


# ---------------------------------------------------------------- text normalisation (shared with extraction/build_source_patterns.py)
ZERO_WIDTH = re.compile("[\u200b\u200c\u200d\u2060\ufeff\u00ad]")
QUOTES = {"\u2018": "'", "\u2019": "'", "\u201a": "'", "\u201b": "'", "\u2032": "'", "\u201c": '"', "\u201d": '"', "\u201e": '"', "\u2033": '"'}
DASHES = re.compile("[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\ufe58\ufe63\uff0d]")
SHINGLE_N = 5


def normalise(s, lower=True):
    s = unicodedata.normalize("NFKC", str(s))
    s = ZERO_WIDTH.sub("", s)
    s = "".join(QUOTES.get(c, c) for c in s)
    s = DASHES.sub("-", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s.lower() if lower else s


def words_of(s):
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", normalise(s))


def shingles(s, n=SHINGLE_N):
    w = words_of(s)
    return {hashlib.sha256(" ".join(w[i:i + n]).encode()).hexdigest()[:16] for i in range(len(w) - n + 1)}


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
    allr = {r["role"]: r for r in assets["roles"]}
    pol = _load("tokens/llm/token-policy.json")
    cat = _load("tokens/llm/token-catalog.json")["categories"]
    themes = {}
    for t in pol["themes"]:
        p = os.path.join(ROOT, "tokens", "themes", t + ".json")
        themes[t] = _load(os.path.join("tokens", "themes", t + ".json"))["resolves"] if os.path.exists(p) else None
    pats_path = os.path.join(ROOT, "schema", "source-patterns.json")
    pats = _load("schema/source-patterns.json") if os.path.exists(pats_path) else None
    pin_errors = []
    for k, want in PINNED_AVAILABILITY.items():
        if k not in allr or allr[k].get("availability") != want:
            pin_errors.append(f"registry availability of {k} is {allr.get(k, {}).get('availability')!r}, pinned {want!r}")
    for k in allr:
        if k not in PINNED_AVAILABILITY:
            pin_errors.append(f"registry role {k} has no PINNED_AVAILABILITY entry")
    for k, want in PINNED_POLICIES.items():
        if k not in allr or allr[k].get("clonePolicy") != want:
            pin_errors.append(f"registry clonePolicy of {k} is {allr.get(k, {}).get('clonePolicy')!r}, pinned {want!r}")
    for r in allr.values():
        if "clonePolicy" in r and r.get("cloneAssetSources") != POLICY_SOURCES.get(r["clonePolicy"]):
            pin_errors.append(f"{r['role']}: cloneAssetSources do not match clonePolicy {r['clonePolicy']}")
        if r.get("availability") != "generation-safe" and r.get("generationAssetSources"):
            pin_errors.append(f"{r['role']}: {r.get('availability')} role lists generationAssetSources")
        if "reuse-exact" in r.get("generationAssetSources", []):
            pin_errors.append(f"{r['role']}: generationAssetSources may never contain reuse-exact")
    return {
        "sections": sections, "templates": templates, "routes": routes, "graph": graph,
        "roles": {k: r for k, r in allr.items() if r["class"] == "asset"},
        "dests": {k: r for k, r in allr.items() if r["class"] == "destination"},
        "endpoints": {k: r for k, r in allr.items() if r["class"] == "form-endpoint"},
        "allroles": allr, "pin_errors": pin_errors,
        "identities": assets["realIdentities"]["customers"] + assets["realIdentities"]["people"],
        "firstNamesOnly": assets["realIdentities"].get("peopleFirstNamesOnly", []),
        "policy": pol, "catalog": {p for v in cat.values() for p in v}, "themes": themes, "patterns": pats,
        "defaultTheme": _load("registry.manifest.json").get("defaultTheme", "light"),
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
def _route_for(ctx, spec):
    """routes.json entry for the PageSpec's route. In mode 'generation' a NEW slug may instantiate a dynamic-instance pattern
    (blog/:slug, case-studies/:slug): the new brand's posts are not Primefold's slugs."""
    route = spec.get("route")
    r = ctx["routes"].get(route)
    if r is not None or spec.get("mode") != "generation" or not isinstance(route, str):
        return r
    for cand in ctx["routes"].values():
        pat = cand.get("appRoutePattern", "")
        if cand.get("kind") == "dynamic-instance" and ":slug" in pat:
            rx = "^/" + re.escape(pat.split(":slug")[0]) + "[a-z0-9]+(-[a-z0-9]+)*$"
            if re.match(rx, route):
                return cand
    return None


def r_route_template_match(ctx, spec):
    r = _route_for(ctx, spec)
    if r is None:
        return [f"route {spec.get('route')!r} is not in templates/routes.json (nor, in generation mode, a new slug of a dynamic route)"]
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
    r = _route_for(ctx, spec)
    if not r:
        return out
    for i, n in enumerate(spec.get("nodes", [])):
        want = r.get("variantOverrides", {}).get(n.get("section"))
        if want and n.get("variant") != want:
            out.append(f"{node_label(i, n)}: route {spec['route']} requires variant {want!r}")
    return out


def _repeatable(ctx, spec, section):
    t = ctx["templates"].get(spec.get("template"))
    return bool(t) and any(n["section"] == section and n.get("repeatable") for n in t["nodes"])


def r_no_adjacent_same_section(ctx, spec):
    ns = spec.get("nodes", [])
    return [f"{node_label(i + 1, b)} repeats the previous (section, variant)" for i, (a, b) in enumerate(zip(ns, ns[1:]))
            if (a.get("section"), a.get("variant")) == (b.get("section"), b.get("variant")) and not _repeatable(ctx, spec, b.get("section"))]


def r_no_adjacent_same_category(ctx, spec):
    out = []
    ex = {(e["template"], e["pair"][0], e["pair"][1]) for e in ctx["graph"]["NO_ADJACENT_SAME_CATEGORY"].get("exceptions", [])}
    ns = spec.get("nodes", [])
    for a, b in zip(ns, ns[1:]):
        ca = ctx["sections"].get(a.get("section"), {}).get("category")
        cb = ctx["sections"].get(b.get("section"), {}).get("category")
        if ca and ca == cb and a["section"] != b["section"] and (spec.get("template"), a["section"], b["section"]) not in ex:
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
    if prod in ("XI", "primary") and not has:
        return [f"{prod} state requires features.comparison-table"]
    if prod in ("RI", "secondary") and has:
        return [f"{prod} state must not include features.comparison-table"]
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


def _mode(spec):
    return spec.get("mode") if spec.get("mode") in ("clone", "generation") else "clone"


def _allowed_sources(role, mode):
    return role.get("cloneAssetSources", []) if mode == "clone" else role.get("generationAssetSources", [])


def r_asset_role_policy(ctx, spec):
    out = [f"pin violation: {e}" for e in ctx["pin_errors"]]
    mode = _mode(spec)
    og = spec.get("meta", {}).get("ogImage")
    if isinstance(og, dict):
        role = ctx["roles"].get(og.get("assetRole"))
        if role is None or not role.get("ogImageEligible"):
            out.append(f"meta.ogImage: role {og.get('assetRole')!r} is not og-image eligible")
        elif role["availability"] == "generation-safe" or mode == "clone":
            if og.get("assetSource") not in _allowed_sources(role, mode):
                out.append(f"meta.ogImage: role {og.get('assetRole')!r} with source {og.get('assetSource')!r} violates the pinned {mode}-mode policy")
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
                    out.append(f"{node_label(i, n)} {path}: endpoint must be 'project-owned-placeholder' (policy {r['clonePolicy'] if r else '?'})")
            if kind != "asset" or not isinstance(v, dict):
                return
            role = ctx["roles"].get(v.get("assetRole"))
            if role is None:
                out.append(f"{node_label(i, n)} {path}: unknown assetRole {v.get('assetRole')!r}")
                return
            if v["assetRole"] not in f["roles"]:
                out.append(f"{node_label(i, n)} {path}: role {v['assetRole']} not allowed in this field (allowed {f['roles']})")
            if mode == "generation" and role["availability"] != "generation-safe":
                return  # reported by the named GENERATION_MODE_* rule for this role
            if v.get("assetSource") not in _allowed_sources(role, mode):
                out.append(f"{node_label(i, n)} {path}: role {v['assetRole']} ({mode} mode, policy {role['clonePolicy']}); assetSource {v.get('assetSource')!r} not allowed (allowed {_allowed_sources(role, mode)})")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def _check_target(ctx, t):
    if not isinstance(t, str):
        return "target must be a string"
    if t.startswith("dest:"):
        return None if t in ctx["dests"] else f"unknown destination role {t}"
    if t.startswith("#"):
        return None
    if PLACEHOLDER_URL_RE.match(t):
        return None
    if t.startswith("/"):
        base = re.split(r"[#?]", t, 1)[0] or "/"
        if base in ctx["routes"] or base.rstrip("/") in ctx["routes"]:
            return None
        return f"internal path {base} is not a route in templates/routes.json"
    return f"target {t!r} is not a route, anchor, dest:<role> or a reserved .example/.invalid placeholder URL (live URLs are forbidden)"


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
                if role and role["clonePolicy"] == "must-not-fabricate" and isinstance(v.get("alt"), str):
                    texts.append(v["alt"])
            for t in texts:
                for name, p in pats:
                    if p.search(t):
                        out.append(f"{node_label(i, n)} {path}: contains real identity {name!r}")
                for name in ctx["firstNamesOnly"]:
                    if t.strip().lower() == name.lower():
                        out.append(f"{node_label(i, n)} {path}: is a real first name {name!r}")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


# ---------------------------------------------------------------- generation mode (identity / content leakage)
def _texts(ctx, spec):
    """Every free-text string a reader would see: content text, link labels, asset alts, meta, brand name. Enum values excluded."""
    out = []
    m = spec.get("meta", {})
    for k in ("title", "description"):
        if isinstance(m.get(k), str):
            out.append(("meta." + k, m[k]))
    if isinstance(m.get("ogImage"), dict) and isinstance(m["ogImage"].get("alt"), str):
        out.append(("meta.ogImage.alt", m["ogImage"]["alt"]))
    b = spec.get("brand")
    if isinstance(b, dict):
        for k in ("name", "domain"):
            if isinstance(b.get(k), str):
                out.append(("brand." + k, b[k]))
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "text" and isinstance(v, str):
                out.append((f"{node_label(i, n)} {path}", v))
            elif kind == "link" and isinstance(v, dict):
                if isinstance(v.get("label"), str):
                    out.append((f"{node_label(i, n)} {path}.label", v["label"]))
            elif kind == "asset" and isinstance(v, dict) and isinstance(v.get("alt"), str):
                out.append((f"{node_label(i, n)} {path}.alt", v["alt"]))
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def _assets(ctx, spec):
    out = []
    og = spec.get("meta", {}).get("ogImage")
    if isinstance(og, dict):
        out.append(("meta.ogImage", og))
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "asset" and isinstance(v, dict):
                out.append((f"{node_label(i, n)} {path}", v))
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def _targets(ctx, spec):
    out = []
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "target" and isinstance(v, str):
                out.append((f"{node_label(i, n)} {path}", v))
            elif kind == "link" and isinstance(v, dict) and isinstance(v.get("to"), str):
                out.append((f"{node_label(i, n)} {path}.to", v["to"]))
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    return out


def _gen(spec):
    return _mode(spec) == "generation"


def _no_patterns(ctx):
    return ["schema/source-patterns.json is missing: generation-mode leakage cannot be checked (rebuild with extraction/build_source_patterns.py)"]


def _term_re(term, case):
    flags = 0 if case else re.I
    return re.compile(r"(?<![A-Za-z0-9])" + re.escape(normalise(term, lower=False)) + r"(?![A-Za-z0-9])", flags)


def _role_rule(role):
    return next((r for p, r in GENERATION_RULE_FOR_ROLE.items() if role.startswith(p)), "GENERATION_MODE_ASSET")


def _blocked_roles(ctx, spec, rule):
    out = []
    for where, v in _assets(ctx, spec):
        r = ctx["roles"].get(v.get("assetRole"))
        if r and r["availability"] != "generation-safe" and _role_rule(r["role"]) == rule:
            out.append(f"{where}: role {r['role']} is {r['availability']} (Primefold/third-party asset) - use {' or '.join(r['generationSafeSubstitutes'])}")
    return out


def r_generation_mode_brand(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = []
    if not isinstance(spec.get("brand"), dict):
        out.append("mode 'generation' requires brand.name (the fictional or user-supplied brand the page is for)")
    res = [(b["term"], _term_re(b["term"], b["caseSensitive"])) for b in ctx["patterns"]["brand"]]
    texts = _texts(ctx, spec)
    if isinstance(spec.get("route"), str):
        texts.append(("route", spec["route"].replace("-", " ").replace("/", " ")))
    for where, t in texts:
        nt = normalise(t, lower=False)
        for term, rx in res:
            if rx.search(nt):
                out.append(f"{where}: contains source brand/product name {term!r}")
                break
    return out


def r_generation_mode_asset(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = _blocked_roles(ctx, spec, "GENERATION_MODE_ASSET")
    stems = set(ctx["patterns"]["assetFiles"]["stems"])
    shots = set(ctx["patterns"]["screenshotFiles"])
    for i, n in enumerate(spec.get("nodes", [])):
        sec = ctx["sections"].get(n.get("section"))
        if not sec:
            continue

        def visit(kind, f, v, path):
            if kind == "enum" and v in f.get("primefoldBadgeValues", []):
                out.append(f"{node_label(i, n)} {path}: {v!r} renders a Primefold product badge; use {[x for x in f['values'] if x not in f['primefoldBadgeValues']]}")
        walk_fields(sec["content"]["fields"], n.get("content", {}), "content", visit)
    for where, v in _assets(ctx, spec):
        if v.get("assetSource") == "reuse-exact":
            out.append(f"{where}: assetSource 'reuse-exact' reuses a Primefold original; generation mode allows generate-new / placeholder / user-supplied only")
        ref = v.get("assetRef")
        if isinstance(ref, str):
            stem = os.path.splitext(os.path.basename(ref.split(":", 1)[-1]))[0]
            if ref.startswith("public/"):
                out.append(f"{where}: assetRef {ref!r} points at a source file")
            elif stem in stems and stem not in shots:
                out.append(f"{where}: assetRef {ref!r} names a real source asset file")
    return out


def r_generation_mode_screenshot(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    shots = set(ctx["patterns"]["screenshotFiles"])
    out = []
    for where, v in _assets(ctx, spec):
        ref = v.get("assetRef")
        if isinstance(ref, str) and os.path.splitext(os.path.basename(ref.split(":", 1)[-1]))[0] in shots:
            out.append(f"{where}: assetRef {ref!r} is a real Primefold product screenshot / editorial cover")
    return out


def r_generation_mode_person(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = _blocked_roles(ctx, spec, "GENERATION_MODE_PERSON")
    full = [(p["name"], _term_re(p["name"], False)) for p in ctx["patterns"]["people"] if p["kind"] == "full-name"]
    first = {normalise(p["name"]) for p in ctx["patterns"]["people"] if p["kind"] == "first-name"}
    first |= {normalise(p["name"].split()[0]) for p in ctx["patterns"]["people"] if p["kind"] == "full-name"}
    for where, t in _texts(ctx, spec):
        nt = normalise(t, lower=False)
        hit = next((nm for nm, rx in full if rx.search(nt)), None)
        if hit:
            out.append(f"{where}: contains real person {hit!r}")
        elif normalise(t) in first:
            out.append(f"{where}: is the first name of a real person in the source ({t!r})")
    return out


def r_generation_mode_customer(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = _blocked_roles(ctx, spec, "GENERATION_MODE_CUSTOMER")
    res = [(c["name"], _term_re(c["name"], c["caseSensitive"])) for c in ctx["patterns"]["customers"]]
    for where, t in _texts(ctx, spec):
        nt = normalise(t, lower=False)
        hit = next((nm for nm, rx in res if rx.search(nt)), None)
        if hit:
            out.append(f"{where}: contains real customer {hit!r}")
    return out


def r_generation_mode_copy(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    hs = set(ctx["patterns"]["copyShingles"]["hashes"])
    out = []
    for where, t in _texts(ctx, spec):
        w = words_of(t)
        for k in range(len(w) - SHINGLE_N + 1):
            run = " ".join(w[k:k + SHINGLE_N])
            if hashlib.sha256(run.encode()).hexdigest()[:16] in hs:
                out.append(f"{where}: reuses Primefold source copy (5-word run {run!r})")
                break
    return out


def r_generation_mode_claim(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    res = [(c["value"], re.compile(r"(?<![a-z0-9])" + re.escape(normalise(c["value"])) + r"(?![a-z0-9])")) for c in ctx["patterns"]["claims"]]
    out = []
    for where, t in _texts(ctx, spec):
        nt = normalise(t)
        hit = next((v for v, rx in res if rx.search(nt)), None)
        if hit:
            out.append(f"{where}: reuses a source statistic/claim {hit!r}")
    return out


URLISH = re.compile(r"(https?://\S+|www\.\S+|[a-z0-9.-]*@[a-z0-9-]+(\.[a-z0-9-]+)+|\b[a-z0-9-]+(\.[a-z0-9-]+)*\.(com|ai|io|de|net|org|app|co|jobs|eu|me|so|dev|tv|info|biz|us|uk)\b)")


def r_generation_mode_url(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = []
    hosts = [h["host"] for h in ctx["patterns"]["hosts"]]
    for where, t in _texts(ctx, spec):
        nt = normalise(t)
        for m in URLISH.finditer(nt):
            u = m.group(0).rstrip(".,;:)")
            host = re.sub(r"^(https?://)?(www\.)?", "", u).split("/")[0].split("@")[-1]
            if not re.search(r"\.(example|invalid)$", host):
                out.append(f"{where}: contains a non-placeholder URL/domain {u!r} (only .example/.invalid are allowed)")
                break
        else:
            h = next((h for h in hosts if h in nt), None)
            if h:
                out.append(f"{where}: contains source host {h!r}")
    for where, t in _targets(ctx, spec):
        if t.startswith("dest:") and t in ctx["dests"] and ctx["dests"][t]["availability"] != "generation-safe":
            r = ctx["dests"][t]
            out.append(f"{where}: {t} is {r['availability']} (Primefold product help centre / real client website) - use {' or '.join(r['generationSafeSubstitutes'])}")
    return out


def r_generation_mode_embed(ctx, spec):
    if not _gen(spec):
        return []
    if ctx["patterns"] is None:
        return _no_patterns(ctx)
    out = _blocked_roles(ctx, spec, "GENERATION_MODE_EMBED")
    hosts = [e["host"] for e in ctx["patterns"]["embeds"]]
    for where, t in _texts(ctx, spec):
        nt = normalise(t)
        h = next((h for h in hosts if h in nt), None)
        if h:
            out.append(f"{where}: references third-party video host {h!r}")
    return out


def r_retrieval_eligibility(ctx, spec):
    out = []
    real = {k for k, s in ctx["sections"].items() if s.get("retrievalEligible") is False}
    if real != RETRIEVAL_INELIGIBLE:
        out.append(f"section contracts' retrievalEligible disagree with the pinned RETRIEVAL_INELIGIBLE set: {sorted(real ^ RETRIEVAL_INELIGIBLE)}")
    for k, s in ctx["sections"].items():
        if s.get("retrievalEligible") is False and len(s.get("retrievalReason", "")) < 30:
            out.append(f"{k}: retrievalEligible false without a 30+ character retrievalReason")
        if RUNTIME_UI_RE.search(k + " " + " ".join(s.get("tags", []))) and k not in RETRIEVAL_INELIGIBLE:
            out.append(f"{k}: looks like runtime/utility UI but is not in RETRIEVAL_INELIGIBLE")
    if _gen(spec):
        for i, n in enumerate(spec.get("nodes", [])):
            if n.get("section") in RETRIEVAL_INELIGIBLE:
                out.append(f"{node_label(i, n)}: section is not retrieval-eligible ({ctx['sections'].get(n['section'], {}).get('retrievalReason', 'pinned')[:80]}...)")
    return out


# ---------------------------------------------------------------- style tokens
def _token_checks(ctx, spec):
    """Return {rule: [messages]} for every styleTokens problem."""
    res = {k: [] for k in ("TOKEN_UNKNOWN", "TOKEN_RAW_VALUE", "TOKEN_ARBITRARY_SPACING", "TOKEN_UNSUPPORTED_FONT", "TOKEN_SLOT_CATEGORY", "TOKEN_THEME_COMBINATION")}
    pol = ctx["policy"]
    slots = pol["styleSlots"]
    raw = {k: re.compile(v, re.I) for k, v in pol["rawValuePatterns"].items()}
    theme = spec.get("theme", ctx["defaultTheme"])
    tdef = pol["themes"].get(theme)
    resolves = ctx["themes"].get(theme)
    if tdef is None or resolves is None:
        res["TOKEN_THEME_COMBINATION"].append(f"theme {theme!r} is not a validated theme (tokens/themes/*.json + token-policy themes)")
        return res
    bad_fonts = pol.get("generationModeTokenRules", {}).get("unsupportedFonts", {})
    for i, n in enumerate(spec.get("nodes", [])):
        st = n.get("styleTokens")
        if not isinstance(st, dict):
            continue
        lab = node_label(i, n)
        for slot, v in st.items():
            if slot not in slots or not isinstance(v, str):
                continue
            kind = slots[slot]["kind"]
            accept = slots[slot]["accept"]
            if raw["color"].search(v) or raw["length"].match(v) or (kind == "font" and raw["fontStack"].search(v) and v not in ctx["catalog"]):
                res["TOKEN_RAW_VALUE"].append(f"{lab} styleTokens.{slot}: raw value {v!r}; reference a token path")
                if kind == "spacing":
                    res["TOKEN_ARBITRARY_SPACING"].append(f"{lab} styleTokens.{slot}: arbitrary spacing {v!r}")
                if kind == "font":
                    res["TOKEN_UNSUPPORTED_FONT"].append(f"{lab} styleTokens.{slot}: {v!r} is not a supported font token")
                continue
            if v not in ctx["catalog"]:
                rule = {"spacing": "TOKEN_ARBITRARY_SPACING", "font": "TOKEN_UNSUPPORTED_FONT"}.get(kind, "TOKEN_UNKNOWN")
                res[rule].append(f"{lab} styleTokens.{slot}: {v!r} is not in tokens/llm/token-catalog.json")
                if rule != "TOKEN_UNKNOWN":
                    res["TOKEN_UNKNOWN"].append(f"{lab} styleTokens.{slot}: unknown token {v!r}")
                continue
            if not any(v == a or (a.endswith(".") or a.endswith("-")) and v.startswith(a) for a in accept):
                rule = {"spacing": "TOKEN_ARBITRARY_SPACING", "font": "TOKEN_UNSUPPORTED_FONT"}.get(kind, "TOKEN_SLOT_CATEGORY")
                res[rule].append(f"{lab} styleTokens.{slot}: {v!r} is not accepted by this slot (accepts {accept})")
                if rule != "TOKEN_SLOT_CATEGORY":
                    res["TOKEN_SLOT_CATEGORY"].append(f"{lab} styleTokens.{slot}: wrong category {v!r}")
                continue
            if kind == "font" and _gen(spec) and v in bad_fonts:
                res["TOKEN_UNSUPPORTED_FONT"].append(f"{lab} styleTokens.{slot}: {v} is unsupported in mode 'generation' ({bad_fonts[v][:60]})")
            if kind == "color" and v not in resolves:
                res["TOKEN_THEME_COMBINATION"].append(f"{lab} styleTokens.{slot}: {v} is not resolved by theme {theme!r}")
        sf, tx = st.get("surface"), st.get("text")
        if sf in tdef["textOnSurface"] and tx in ctx["catalog"] and tx not in tdef["textOnSurface"][sf]:
            res["TOKEN_THEME_COMBINATION"].append(f"{lab}: text {tx} is not legible on {sf} in theme {theme!r} (allowed {tdef['textOnSurface'][sf]})")
    return res


def _tok(rule):
    def fn(ctx, spec):
        return _token_checks(ctx, spec)[rule]
    fn.__name__ = "r_" + rule.lower()
    return fn


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
    "GENERATION_MODE_BRAND": r_generation_mode_brand,
    "GENERATION_MODE_ASSET": r_generation_mode_asset,
    "GENERATION_MODE_PERSON": r_generation_mode_person,
    "GENERATION_MODE_CUSTOMER": r_generation_mode_customer,
    "GENERATION_MODE_SCREENSHOT": r_generation_mode_screenshot,
    "GENERATION_MODE_COPY": r_generation_mode_copy,
    "GENERATION_MODE_CLAIM": r_generation_mode_claim,
    "GENERATION_MODE_URL": r_generation_mode_url,
    "GENERATION_MODE_EMBED": r_generation_mode_embed,
    "RETRIEVAL_ELIGIBILITY": r_retrieval_eligibility,
    **{r: _tok(r) for r in ("TOKEN_UNKNOWN", "TOKEN_RAW_VALUE", "TOKEN_ARBITRARY_SPACING", "TOKEN_UNSUPPORTED_FONT", "TOKEN_SLOT_CATEGORY", "TOKEN_THEME_COMBINATION")},
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
        import glob
        argv = [os.path.join(ROOT, "schema", "example.pagespec.json")] + sorted(glob.glob(os.path.join(ROOT, "schema", "examples", "*.json")))
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
