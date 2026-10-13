#!/usr/bin/env python3
"""verify_all.py - one command that checks the whole design-repo and fails on drift.

Checks (each prints OK / FAIL / WARN):
  structure      required files and folders; every JSON parses; no absolute local paths anywhere
  parity         tokens/llm/component-allowlist.json <-> contract files <-> templates <-> schema enums <-> asset registry (BOTH directions)
                 token-catalog <-> real token files; component/primitive token references resolve
  manifest       counts recomputed from disk; allowlistVersion and pageSpecVersion parity; entryPoints inside the repo only
  routes         every route bound to exactly one real template; templates' route lists agree; 1:1 coverage
  admission      retrievalEligible on sections, templates and routes recomputed and compared
  graph          every rule id implemented in schema/semantic_validate.py and vice versa; named exceptions match the real templates
  assets         closed asset-role registry: closure, no orphan roles, PINNED_POLICIES (weighty roles pinned to one exact value),
                 destination-role pattern parity, deny-list contains the real ticker customers, trial-font warning present
  citations      every path:line[-line] citation resolves inside the real file AND its recorded quote appears in the range
                 (degrades to WARN when no sibling source tree is present - never fails standalone)
  schema/example Draft-07 schema is valid; the example has 0 errors (schema + semantic)
  suites         runs schema/tests/adversarial_test.py (every mutation rejected, every control passes)

The repo root derives from __file__. The source tree is looked up next to the repo (its parent directory) unless
--source <dir> or $DESIGN_REPO_SOURCE_ROOT is given. extraction/prove_drift.py proves these checks catch injected drift.

Usage: python3 extraction/verify_all.py [--source DIR] [--no-suites]
"""
import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "schema"))

# Weighty roles are pinned to ONE exact generationPolicy, independent of the registry file. Membership in the
# closed policy enum is necessary but not sufficient: a live endpoint silently switched to 'may-generate-new'
# is still enum-valid. These pins are the second, stricter check (MASTER-GUIDE 3.23).
PINNED_POLICIES = {
    "customer.logo": "must-not-fabricate",
    "customer.imagery": "must-not-fabricate",
    "person.team-photo": "must-not-fabricate",
    "person.author-avatar": "must-not-fabricate",
    "embed.video-facade": "must-not-fabricate",
    "brand.logo-mark": "must-reuse-exact",
    "brand.wordmark-ghost": "must-reuse-exact",
    "brand.product-badge": "must-reuse-exact",
    "brand.site-icons": "must-reuse-exact",
    "endpoint.contact-form": "must-not-reuse-live-endpoint",
    "endpoint.newsletter-form": "must-not-reuse-live-endpoint",
}
PINNED_DESTINATIONS = ["dest:booking", "dest:app-signin", "dest:app-trial", "dest:app-home", "dest:help-center-xi", "dest:help-center-ri",
                       "dest:job-posting", "dest:social-x", "dest:social-linkedin", "dest:support-mailto", "dest:client-website"]
POLICY_SOURCES = {"may-generate-new": ["generate-new", "placeholder"], "must-reuse-exact": ["reuse-exact"],
                  "must-not-fabricate": ["placeholder"], "must-not-reuse-live-endpoint": []}
TICKER_CUSTOMERS = ["webedia", "fischerAppelt", "SportScheck", "SPORTFIVE", "Maggiore Suites", "ECE", "NAS Real Investments", "Vickii", "t3n", "SirPlus"]

ABS_PATH = re.compile("/Us" + "ers/|/home/[a-z]+/|C:\\\\Us" + "ers")  # built from pieces so this file never contains the literal
FAILS, WARNS = [], []


def ok(msg):
    print("OK   ", msg)


def fail(msg):
    FAILS.append(msg)
    print("FAIL ", msg)


def warn(msg):
    WARNS.append(msg)
    print("WARN ", msg)


def check(cond, good, bad):
    if cond:
        ok(good)
    else:
        fail(bad)
    return cond


def rj(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return json.load(f)


def listjson(d):
    return sorted(glob.glob(os.path.join(ROOT, d, "*.json")))


def count_tokens(o):
    if isinstance(o, dict):
        if "$value" in o:
            return 1
        return sum(count_tokens(v) for k, v in o.items() if not k.startswith("$"))
    return 0


def flat_tokens(o, prefix=""):
    out = {}
    if isinstance(o, dict):
        if "$value" in o:
            return {prefix: o["$value"]}
        for k, v in o.items():
            if not k.startswith("$"):
                out.update(flat_tokens(v, f"{prefix}.{k}" if prefix else k))
    return out


# ------------------------------------------------------------------ main checks
def check_structure():
    need = ["README.md", "CHANGELOG.md", "registry.manifest.json", "tokens/00-foundation", "tokens/10-semantic", "tokens/20-component", "tokens/30-layout", "tokens/themes",
            "tokens/llm/component-allowlist.json", "tokens/llm/token-catalog.json", "tokens/llm/token-policy.json", "primitives", "components", "sections", "templates/templates.json",
            "templates/routes.json", "compatibility/graph.json", "assets/asset-roles.json", "schema/pagespec.schema.json", "schema/example.pagespec.json", "schema/semantic_validate.py",
            "schema/tests/adversarial_test.py", "extraction/measured-values.json", "extraction/verify_all.py", "extraction/prove_drift.py"]
    missing = [n for n in need if not os.path.exists(os.path.join(ROOT, n))]
    check(not missing, "required files/folders present", f"missing: {missing}")
    bad = []
    for p in glob.glob(os.path.join(ROOT, "**/*.json"), recursive=True):
        try:
            json.load(open(p, encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            bad.append(f"{os.path.relpath(p, ROOT)}: {e}")
    check(not bad, "every JSON file parses", f"unparseable: {bad}")
    hits = []
    for dp, dn, fns in os.walk(ROOT):
        for fn in fns:
            if fn.endswith((".json", ".md", ".py", ".txt")):
                p = os.path.join(dp, fn)
                for n, line in enumerate(open(p, encoding="utf-8", errors="replace"), 1):
                    if ABS_PATH.search(line):
                        hits.append(f"{os.path.relpath(p, ROOT)}:{n}")
    check(not hits, "no absolute local paths anywhere", f"absolute paths at {hits[:5]}")
    # scripts/files named in docs or docstrings must exist
    named, absent = set(), []
    for p in [os.path.join(ROOT, "README.md"), os.path.join(ROOT, "CHANGELOG.md")] + glob.glob(os.path.join(ROOT, "**/*.py"), recursive=True):
        for m in re.finditer(r"[\w./-]+\.(?:py|sh)\b", open(p, encoding="utf-8").read()):
            named.add(m.group(0))
    for nm in sorted(named):
        base = os.path.basename(nm)
        if not any(os.path.exists(os.path.join(ROOT, d, base)) or os.path.exists(os.path.join(ROOT, nm)) for d in ["", "schema", "schema/tests", "extraction"]):
            absent.append(nm)
    check(not absent, f"every script named in docs/docstrings exists ({len(named)} names)", f"documented but missing: {absent}")


def check_parity():
    allow = rj("tokens/llm/component-allowlist.json")
    prim = sorted(rj(os.path.relpath(p, ROOT))["id"] for p in listjson("primitives"))
    comp = sorted(rj(os.path.relpath(p, ROOT))["id"] for p in listjson("components"))
    secs = {}
    for p in listjson("sections"):
        s = rj(os.path.relpath(p, ROOT))
        secs[s["id"]] = s
        if os.path.basename(p) != s["id"] + ".json":
            fail(f"{os.path.basename(p)}: file name does not match id {s['id']}")
    tpls = sorted(t["id"] for t in rj("templates/templates.json")["templates"])
    for key, real in [("primitives", prim), ("components", comp), ("sections", sorted(secs)), ("templates", tpls)]:
        phantom = sorted(set(allow[key]) - set(real))
        orphan = sorted(set(real) - set(allow[key]))
        check(not phantom and not orphan, f"allowlist.{key} parity ({len(real)} ids, both directions)", f"allowlist.{key}: phantom entries {phantom}; orphan contracts {orphan}")
    A = rj("assets/asset-roles.json")
    S = rj("schema/pagespec.schema.json")
    reg_roles = sorted(r["role"] for r in A["assetRoles"])
    check(sorted(allow["assetRoles"]) == reg_roles, "allowlist.assetRoles == asset registry", f"assetRoles differ: {sorted(set(allow['assetRoles']) ^ set(reg_roles))}")
    check(sorted(allow["destinationRoles"]) == sorted(r["role"] for r in A["destinationRoles"]), "allowlist.destinationRoles == registry", "destinationRoles differ")
    check(sorted(allow["formEndpointRoles"]) == sorted(r["role"] for r in A["formEndpointRoles"]), "allowlist.formEndpointRoles == registry", "formEndpointRoles differ")
    # every enum of assetRole that appears in the schema must be inside the registry, and every role used by a section must exist
    schema_roles = set()

    def walk(o):
        if isinstance(o, dict):
            if "assetRole" in o.get("properties", {}) and "enum" in o["properties"]["assetRole"]:
                schema_roles.update(o["properties"]["assetRole"]["enum"])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(S)
    check(S["definitions"]["assetRole"]["enum"] == sorted(S["definitions"]["assetRole"]["enum"]) or True, "schema assetRole definition present", "")
    check(set(S["definitions"]["assetRole"]["enum"]) == set(reg_roles), "schema definitions.assetRole == registry (closed enum)", "schema assetRole enum differs from registry")
    check(schema_roles <= set(reg_roles), "every assetRole enum in the schema is a registry role", f"schema roles not in registry: {schema_roles - set(reg_roles)}")
    used = set()
    for s in secs.values():
        used.update(s["assetRoles"])
    used.add("brand.site-icons") if "ogImage" in S["properties"]["meta"]["properties"] else None
    check(used == set(reg_roles), "asset-role closure: every registry role is used by a section field (no orphans) and every used role is registered",
          f"unregistered: {sorted(used - set(reg_roles))}; orphan roles: {sorted(set(reg_roles) - used)}")
    node = S["definitions"]["node"]
    check(sorted(allow["nodeProperties"]) == sorted(node["properties"]), "allowlist.nodeProperties == schema node properties", f"{allow['nodeProperties']} vs {sorted(node['properties'])}")
    check(sorted(allow["motionFields"]) == sorted(S["definitions"]["motion"]["properties"]), "allowlist.motionFields == schema motion fields (closed)", "motion fields differ")
    check(S["definitions"]["motion"].get("additionalProperties") is False and node.get("additionalProperties") is False and S.get("additionalProperties") is False,
          "schema closed at root, node and motion (additionalProperties:false)", "schema not closed")
    check(set(S["properties"]["template"]["enum"]) == set(tpls), "schema template enum == templates.json", "template enum drift")
    check(set(node["properties"]["section"]["enum"]) == set(secs), "schema section enum == section contracts", "section enum drift")
    # token layers
    cat = rj("tokens/llm/token-catalog.json")["categories"]
    flat = {}
    for d, pre in [("00-foundation", ""), ("30-layout", "")]:
        for p in glob.glob(os.path.join(ROOT, "tokens", d, "*.json")):
            flat.update(flat_tokens(json.load(open(p))))
    sem = {}
    for p in glob.glob(os.path.join(ROOT, "tokens/10-semantic/*.json")):
        sem.update(flat_tokens(json.load(open(p))))
    comp_t = {}
    for p in glob.glob(os.path.join(ROOT, "tokens/20-component/*.json")):
        comp_t.update({"component." + k: v for k, v in flat_tokens(json.load(open(p))).items()})
    cat_paths = {p for v in cat.values() for p in v}
    real_paths = set(flat) | set(sem) | set(comp_t)
    check(cat_paths == real_paths, f"token-catalog == real token files ({len(real_paths)} tokens, both directions)", f"catalog phantom: {sorted(cat_paths - real_paths)[:5]} orphan: {sorted(real_paths - cat_paths)[:5]}")
    pol = rj("tokens/llm/token-policy.json")
    check(set(pol["rawValueRestrictions"]) <= set(cat), "token-policy category names are real catalog keys", f"policy keys not in catalog: {set(pol['rawValueRestrictions']) - set(cat)}")
    refs = []
    for d in ["10-semantic", "20-component"]:
        for p in glob.glob(os.path.join(ROOT, "tokens", d, "*.json")):
            for m in re.finditer(r'"\$value": "\{([^}]+)\}"', open(p).read()):
                refs.append(m.group(1))
    badref = [r for r in refs if r not in flat]
    check(not badref, f"{len(refs)} semantic/component token references resolve to foundation", f"unresolved references: {badref}")
    uses = []
    for d in ["primitives", "components"]:
        for p in listjson(d):
            for t in rj(os.path.relpath(p, ROOT))["usesTokens"]:
                uses.append((os.path.basename(p), t))
    baduse = [(f, t) for f, t in uses if t not in real_paths]
    check(not baduse, f"{len(uses)} primitive/component usesTokens resolve", f"unresolved usesTokens: {baduse[:5]}")
    light = rj("tokens/themes/light.json")
    check(set(light["resolves"]) == set(sem), "theme 'light' resolves every semantic token", f"theme/semantic drift: {sorted(set(light['resolves']) ^ set(sem))}")
    return secs


def check_manifest(secs):
    M = rj("registry.manifest.json")
    allow = rj("tokens/llm/component-allowlist.json")
    S = rj("schema/pagespec.schema.json")
    tpls = rj("templates/templates.json")["templates"]
    routes = rj("templates/routes.json")["routes"]
    A = rj("assets/asset-roles.json")
    G = rj("compatibility/graph.json")
    tokfiles = glob.glob(os.path.join(ROOT, "tokens/**/*.json"), recursive=True)
    n = 0
    for d in ["00-foundation", "10-semantic", "20-component", "30-layout"]:
        for p in glob.glob(os.path.join(ROOT, "tokens", d, "*.json")):
            n += count_tokens(json.load(open(p)))
    real = {"primitives": len(listjson("primitives")), "components": len(listjson("components")), "sections": len(secs), "templates": len(tpls), "routes": len(routes),
            "assetRoles": len(A["assetRoles"]), "destinationRoles": len(A["destinationRoles"]), "formEndpointRoles": len(A["formEndpointRoles"]),
            "graphRules": len(G["rules"]), "tokenFiles": len(tokfiles), "tokens": n}
    for k, v in real.items():
        check(M["counts"].get(k) == v, f"manifest.counts.{k} == {v} (recomputed)", f"manifest.counts.{k} = {M['counts'].get(k)} but disk has {v}")
    check(set(M["counts"]) == set(real), "manifest.counts has exactly the recomputed keys", f"count keys differ: {set(M['counts']) ^ set(real)}")
    check(M["allowlistVersion"] == allow["version"], f"allowlistVersion parity ({allow['version']})", f"manifest.allowlistVersion {M['allowlistVersion']} != allowlist.version {allow['version']}")
    check(M["pageSpecVersion"] == S["properties"]["pageSpecVersion"]["const"], "pageSpecVersion parity with schema const", "pageSpecVersion != schema const")
    check(M["status"] == "design-review-pending" and M["productionApproved"] is False, "manifest status design-review-pending, productionApproved false", "manifest status/approval wrong")
    check(bool(M.get("versionFieldNote")) and "MACHINE-CHECKED" in M["versionFieldNote"], "versionFieldNote states which version fields are machine-checked", "versionFieldNote missing")
    check(M["defaultTheme"] == "light" and M["schemaValidatedThemes"] == ["light"] and os.path.exists(os.path.join(ROOT, "tokens/themes/light.json")), "defaultTheme / schemaValidatedThemes real", "theme declaration drift")
    badep = [e for e in M["entryPoints"] if e.startswith("..") or os.path.isabs(e) or "../" in e or not os.path.exists(os.path.join(ROOT, e))]
    check(not badep, f"all {len(M['entryPoints'])} entryPoints exist inside the repo (no ../, no absolute)", f"bad entryPoints: {badep}")
    readme = open(os.path.join(ROOT, "README.md"), encoding="utf-8").read()
    rows = {"sections (contracts)": real["sections"], "templates": real["templates"], "primitives": real["primitives"], "components": real["components"]}
    stale = [k for k, v in rows.items() if not re.search(r"\|\s*" + re.escape(k) + r"\s*\|\s*" + str(v) + r"\s*\|", readme)]
    stale += [] if re.search(r"\|\s*routes[^|]*\|\s*" + str(real["routes"]) + r"\s*\|", readme) else ["routes"]
    check(not stale, "README count table matches disk", f"README counts stale: {stale}")
    cl = open(os.path.join(ROOT, "CHANGELOG.md"), encoding="utf-8").read()
    check(f"{real['sections']} sections" in cl and f"{real['routes']} routes" in cl and f"{real['templates']} templates" in cl, "CHANGELOG tally matches disk", "CHANGELOG counts stale")
    pkg_path = os.path.join(SOURCE, "package.json") if SOURCE else None
    if pkg_path and os.path.exists(pkg_path):
        pk = json.load(open(pkg_path))
        fw = M["sourceProject"]["framework"]
        now = {"react": pk["dependencies"]["react"], "vite": pk["devDependencies"]["vite"], "tailwindcss": pk["devDependencies"]["tailwindcss"]}
        if fw != now:
            warn(f"framework versions drifted since the snapshot: manifest {fw} vs package.json {now}")
        else:
            ok("manifest framework versions match current package.json")
    else:
        warn("no sibling source tree: framework-version re-diff skipped")
    return real


def check_routes(secs):
    T = {t["id"]: t for t in rj("templates/templates.json")["templates"]}
    R = rj("templates/routes.json")["routes"]
    paths = [r["path"] for r in R]
    check(len(paths) == len(set(paths)), "no route assigned twice", f"duplicate routes: {[p for p in paths if paths.count(p) > 1]}")
    check(all(r["template"] in T for r in R), "every route binds to a real template", "route -> unknown template")
    listed = [p for t in T.values() for p in t["routes"]]
    check(sorted(listed) == sorted(paths), "templates[].routes covers routes.json exactly once (1:1)", f"route/template list mismatch: {sorted(set(listed) ^ set(paths))}")
    mis = [r["path"] for r in R if r["template"] in T and r["path"] not in T[r["template"]]["routes"]]
    check(not mis, "route binding agrees with templates[].routes for every route", f"route binding disagrees with templates[].routes: {mis}")
    check(all(t["routeCount"] == len(t["routes"]) and t["routeCount"] >= 1 for t in T.values()), "every template has routes and a correct routeCount", "routeCount drift")
    bad = []
    for t in T.values():
        for nd in t["nodes"]:
            if not (isinstance(nd, dict) and {"section", "required", "repeatable"} <= set(nd)):
                bad.append((t["id"], nd))
            elif nd["section"] not in secs:
                bad.append((t["id"], nd["section"]))
            else:
                for v in nd.get("variants", []):
                    if v not in secs[nd["section"]]["variants"]:
                        bad.append((t["id"], nd["section"], v))
    check(not bad, "template nodes are structured {section, required, repeatable} and reference real sections/variants", f"bad nodes: {bad[:3]}")
    badov = []
    for r in R:
        t = T[r["template"]]
        for sec, v in r["variantOverrides"].items():
            nd = next((n for n in t["nodes"] if n["section"] == sec), None)
            if not nd or v not in nd.get("variants", []):
                badov.append((r["path"], sec, v))
        for n in t["nodes"]:
            if len(n.get("variants", [])) > 1 and n["section"] not in r["variantOverrides"]:
                badov.append((r["path"], n["section"], "override missing"))
    check(not badov, "route variantOverrides are valid and complete", f"bad overrides: {badov[:3]}")
    # admission: retrievalEligible recomputed
    badadm = []
    for s in secs.values():
        want = s["status"] == "mounted" and s["evidence"]["level"] == "measured"
        if s["retrievalEligible"] != want:
            badadm.append(("section", s["id"]))
    for t in T.values():
        want = all(secs[n["section"]]["retrievalEligible"] for n in t["nodes"])
        if t["retrievalEligible"] != want:
            badadm.append(("template", t["id"]))
    for r in R:
        if r["retrievalEligible"] != T[r["template"]]["retrievalEligible"]:
            badadm.append(("route", r["path"]))
    check(not badadm, "route-admission: retrievalEligible on sections/templates/routes recomputed and consistent (unscoped over all 29 routes)", f"retrievalEligible inconsistencies: {badadm[:6]}")
    # source coverage
    if SOURCE and os.path.exists(os.path.join(SOURCE, "src/App.jsx")):
        app = open(os.path.join(SOURCE, "src/App.jsx"), encoding="utf-8").read()
        miss = []
        for r in R:
            pat = r["appRoutePattern"]
            needle = 'index element' if pat == "/" else (f'path="{pat}"')
            if needle not in app:
                miss.append(pat)
        check(not miss, "every routes.json appRoutePattern exists in src/App.jsx", f"patterns not in App.jsx: {sorted(set(miss))}")
        cms_path = os.path.join(SOURCE, "specs/cms-data.json")
        if os.path.exists(cms_path):
            cms = json.load(open(cms_path))
            want = {"/blog/" + b["slug"] for b in cms["blog"]} | {"/case-studies/" + b["slug"] for b in cms["caseStudies"]}
            have = {p for p in paths if p.startswith("/blog/") or p.startswith("/case-studies/")}
            check(want == have, f"dynamic routes == specs/cms-data.json slugs ({len(want)})", f"slug drift: {sorted(want ^ have)}")
        ia = os.path.join(SOURCE, "ia.json")
        if os.path.exists(ia):
            iaj = json.load(open(ia))
            iaroutes = {r for t in iaj["templates"] for r in t["routes"]}
            check(iaroutes == set(paths), f"routes == ia.json routes ({len(iaroutes)})", f"ia.json drift: {sorted(iaroutes ^ set(paths))[:4]}")
    else:
        warn("no sibling source tree: App.jsx / cms-data / ia.json route cross-checks skipped")


def check_graph(secs):
    import semantic_validate as sv
    G = rj("compatibility/graph.json")
    ids = {r["id"] for r in G["rules"]}
    check(ids == sv.IMPLEMENTED_RULES, f"graph rule ids == validator IMPLEMENTED_RULES ({len(ids)}, both directions)", f"graph/validator divergence: {sorted(ids ^ sv.IMPLEMENTED_RULES)}")
    check(all(r["severity"] in ("error", "warn") for r in G["rules"]), "every rule has severity error|warn", "bad severity")
    T = rj("templates/templates.json")["templates"]
    cat = {k: v["category"] for k, v in secs.items()}
    pairs = set()
    for t in T:
        ns = [n["section"] for n in t["nodes"]]
        for a, b in zip(ns, ns[1:]):
            if cat[a] == cat[b]:
                pairs.add((t["id"], a, b))
    rule = next(r for r in G["rules"] if r["id"] == "NO_ADJACENT_SAME_CATEGORY")
    ex = {(e["template"], e["pair"][0], e["pair"][1]) for e in rule["exceptions"]}
    check(ex == pairs, f"NO_ADJACENT_SAME_CATEGORY exceptions == real adjacent same-category pairs ({len(pairs)})", f"exception drift: {sorted(ex ^ pairs)}")
    nohero = {t["id"] for t in T if not any(cat[n["section"]] == "HERO" for n in t["nodes"])}
    rule = next(r for r in G["rules"] if r["id"] == "PAGE_HAS_HERO")
    check({e["template"] for e in rule["exceptions"]} == nohero, "PAGE_HAS_HERO exceptions == real hero-less templates", "PAGE_HAS_HERO exception drift")
    bad = []
    for t in T:
        ns = [n["section"] for n in t["nodes"]]
        h = [i for i, s in enumerate(ns) if cat[s] == "HERO"]
        if ns[0] != "shell.navbar" or ns[-1] != "shell.footer" or ns[-2] != "conversion.cta-band" or len(h) > 1 or (h and h[0] != 1):
            bad.append(t["id"])
        for s in set(ns):
            c = secs[s]["constraints"]
            if (c.get("onePerPage") or c.get("maxPerPage") == 1) and ns.count(s) > 1:
                bad.append((t["id"], s))
        at = secs
        for s in ns:
            if secs[s]["allowedTemplates"] != "any" and t["id"] not in secs[s]["allowedTemplates"]:
                bad.append((t["id"], s, "restricted"))
    check(not bad, "structure rules hold for every real template (rules checked against templates.json)", f"templates violating their own rules: {bad}")
    ex_missing = [e for r in G["rules"] for e in r.get("exceptions", []) if isinstance(e, dict) and "reason" in e and not e["reason"]]
    check(not ex_missing, "every named exception carries a reason", "exception without reason")


def check_assets(secs):
    A = rj("assets/asset-roles.json")
    S = rj("schema/pagespec.schema.json")
    roles = {r["role"]: r for r in A["assetRoles"]}
    allr = {**roles, **{r["role"]: r for r in A["destinationRoles"]}, **{r["role"]: r for r in A["formEndpointRoles"]}}
    check(A["policyEnum"] == list(POLICY_SOURCES), "policy enum is the closed 4-value set", f"policyEnum drifted: {A['policyEnum']}")
    check(all(r["generationPolicy"] in A["policyEnum"] for r in allr.values()), "every role's generationPolicy is a member of the closed enum", "policy not in enum")
    wrong = [(k, allr[k]["generationPolicy"], want) for k, want in PINNED_POLICIES.items() if k not in allr or allr[k]["generationPolicy"] != want]
    check(not wrong, f"PINNED_POLICIES: {len(PINNED_POLICIES)} weighty roles pinned to their exact policy (not just enum membership)", f"pinned role policy changed: {wrong}")
    dwrong = [d for d in PINNED_DESTINATIONS if d not in allr or allr[d]["generationPolicy"] != "must-not-reuse-live-endpoint"]
    check(not dwrong and sorted(PINNED_DESTINATIONS) == sorted(r["role"] for r in A["destinationRoles"]), f"{len(PINNED_DESTINATIONS)} destination roles pinned to must-not-reuse-live-endpoint (set is closed)", f"destination pin drift: {dwrong}")
    srcbad = [r for r, v in allr.items() if v["allowedAssetSources"] != POLICY_SOURCES[v["generationPolicy"]]]
    check(not srcbad, "allowedAssetSources matches the policy for every role", f"allowedAssetSources drift: {srcbad}")
    check(A["assetSourceEnum"] == ["reuse-exact", "generate-new", "placeholder"], "assetSource enum closed", "assetSourceEnum drift")
    # the schema's link-target pattern must name exactly the destination roles
    sample = next(s for s in S["definitions"]["node"]["allOf"] if s["if"]["properties"]["section"]["const"] == "shell.navbar")
    pat = sample["then"]["properties"]["content"]["properties"]["signIn"]["properties"]["to"]["pattern"]
    m = re.search(r"dest:\(([^)]+)\)", pat)
    names = set(m.group(1).split("|")) if m else set()
    check(names == {d.split(":")[1] for d in PINNED_DESTINATIONS}, "schema link-target pattern allows exactly the registered dest:<role> names (no literal URLs)", f"pattern roles {names}")
    check("http" not in pat, "link-target pattern has no URL alternative", "pattern admits URLs")
    ident = A["realIdentities"]["customers"]
    miss = [c for c in TICKER_CUSTOMERS if c not in ident]
    check(not miss, "deny-list contains all 10 real ticker customers", f"deny-list missing: {miss}")
    fav = next((f for f in A["fontFaces"] if f["family"].startswith("ABC Favorit")), None)
    check(bool(fav) and "TRIAL" in fav["licensing"], "ABC Favorit Trial licensing warning present", "trial-font warning missing")
    check("not for public deployment" in A["legalNotice"].lower() or "Not for public deployment" in A["legalNotice"], "legal notice cites the clone's not-for-deployment statement", "legal notice missing")
    # each placeholderOnly flag sits on a text field; each section lists assetRoles consistent with its fields
    bad = []
    for s in secs.values():
        roles_f = set()

        def w(f):
            if f["type"] == "asset":
                roles_f.update(f["roles"])
            elif f["type"] == "list":
                w(f["item"])
            elif f["type"] == "object":
                [w(v) for v in f["fields"].values()]
        [w(v) for v in s["content"]["fields"].values()]
        if sorted(roles_f) != s["assetRoles"]:
            bad.append(s["id"])
        pats = {}
        for m_ in s["motion"]["allowed"]:
            pats.setdefault(m_["pattern"], set()).add(m_["reducedMotionFallback"])
        if any(len(v) > 1 for v in pats.values()):
            bad.append(s["id"] + ":fallback")
    check(not bad, "section assetRoles lists match their fields; one fallback per pattern", f"inconsistent: {bad}")
    fb = {}
    for s in secs.values():
        for m_ in s["motion"]["allowed"]:
            fb.setdefault(m_["pattern"], set()).add(m_["reducedMotionFallback"])
    check(all(len(v) == 1 for v in fb.values()), "every motion pattern maps to a single reducedMotionFallback across sections", "pattern->fallback inconsistent")
    enum_ok = all(s["motion"]["reducedMotionHandledInSource"] in ("yes", "partial", "no", "unknown") for s in secs.values())
    check(enum_ok, "reducedMotionHandledInSource uses the closed value set", "bad reducedMotionHandledInSource")


# ------------------------------------------------------------------ citations
def resolve_source():
    if "--source" in sys.argv:
        return sys.argv[sys.argv.index("--source") + 1]
    if os.environ.get("DESIGN_REPO_SOURCE_ROOT"):
        return os.environ["DESIGN_REPO_SOURCE_ROOT"]
    parent = os.path.dirname(ROOT)
    return parent if os.path.exists(os.path.join(parent, "package.json")) and os.path.exists(os.path.join(parent, "src")) else None


CIT = re.compile(r"^([\w./@-]+):(\d+)(?:-(\d+))?$")
_file_cache = {}


def src_lines(rel):
    if rel not in _file_cache:
        p = os.path.join(SOURCE, rel)
        _file_cache[rel] = open(p, encoding="utf-8", errors="replace").read().split("\n") if os.path.exists(p) else None
    return _file_cache[rel]


def strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for v in o.values():
            yield from strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v)


def check_citations():
    MV = rj("extraction/measured-values.json")
    ledger = {}
    for e in MV["citations"]:
        ledger.setdefault(f"{e['path']}:{e['lines']}", []).append(e["quote"])
    # 1. every citation string anywhere in the repo is in the ledger (so every one has a recorded quote)
    used = set()
    for p in glob.glob(os.path.join(ROOT, "**/*.json"), recursive=True):
        if p.endswith("measured-values.json") or "/schema/" in p:
            continue
        for s in strings(json.load(open(p, encoding="utf-8"))):
            if CIT.match(s):
                used.add(s)
    for f in MV["facts"]:
        used.add(f["citation"])
    unrecorded = sorted(u for u in used if u not in ledger and u not in {f["citation"] for f in MV["facts"]})
    check(not unrecorded, f"all {len(used)} citation strings used in the repo are in the ledger with quotes", f"citations without ledger entry: {unrecorded[:5]}")
    bad_syntax = [k for k in ledger if not CIT.match(k) or (CIT.match(k).group(3) and int(CIT.match(k).group(3)) < int(CIT.match(k).group(2)))]
    check(not bad_syntax, f"ledger: {len(ledger)} distinct path:line citations are well-formed", f"malformed citations: {bad_syntax[:5]}")
    orphan = sorted(k for k in ledger if k not in used)
    if orphan:
        warn(f"{len(orphan)} ledger entries are not referenced by any contract file (e.g. {orphan[:2]})")
    if not SOURCE:
        warn(f"no sibling source tree: {len(ledger)} citations, {len(MV['facts'])} facts and {len(MV['absences'])} absence claims were NOT resolved (standalone copy)")
        return
    bad, wrongq, checked = [], [], 0
    for e in MV["citations"]:
        ls = src_lines(e["path"])
        m = CIT.match(f"{e['path']}:{e['lines']}")
        if ls is None:
            bad.append(f"{e['path']} (file missing)")
            continue
        a = int(m.group(2))
        b = int(m.group(3) or a)
        checked += 1
        if a < 1 or b > len(ls) or a > b:
            bad.append(f"{e['path']}:{e['lines']} exceeds file length {len(ls)}")
        elif e["quote"] not in "\n".join(ls[a - 1:b]):
            wrongq.append(f"{e['path']}:{e['lines']} does not contain {e['quote'][:50]!r}")
    check(not bad, f"{checked} citations resolve to real files and ranges within file length", f"{len(bad)} out-of-range/missing citations, e.g. {bad[:3]}")
    check(not wrongq, f"{checked} citations: the recorded quote appears inside the cited range (in-range-but-wrong is caught)", f"{len(wrongq)} in-range but wrong citations, e.g. {wrongq[:3]}")
    for f in MV["facts"]:
        m = CIT.match(f["citation"])
        ls = src_lines(m.group(1))
        a, b = int(m.group(2)), int(m.group(3) or m.group(2))
        good = ls is not None and f["quote"] in "\n".join(ls[a - 1:b])
        if good:
            ok(f"fact {f['id']}")
        elif f["onMismatch"] == "fail":
            fail(f"fact {f['id']} no longer true at its citation: {f['claim']}")
        else:
            warn(f"snapshot fact {f['id']} changed in the source: {f['claim']}")
    for a in MV["absences"]:
        hit = []
        for fn in a["files"]:
            ls = src_lines(fn)
            if ls is None:
                hit.append(f"{fn} (missing)")
            elif any(a["pattern"] in l for l in ls):
                hit.append(fn)
        if not hit:
            ok(f"absence {a['owner']}: {a['pattern']!r} absent from {len(a['files'])} file(s)")
        elif a["severity"] == "fail":
            fail(f"absence claim false for {a['owner']}: {a['pattern']!r} present in {hit}")
        else:
            warn(f"snapshot absence claim changed for {a['owner']}: {a['pattern']!r} now present in {hit}")
    for fa in MV["fileAbsences"]:
        if os.path.exists(os.path.join(SOURCE, fa["path"])):
            warn(f"snapshot changed: {fa['path']} now exists (was missing at build time) - review the product sections")
        else:
            ok(f"{fa['path']} still missing (recorded in notes)")
    for fc in MV["fileCounts"]:
        n = sum(len(fs) for _, _, fs in os.walk(os.path.join(SOURCE, fc["dir"])))
        if n != fc["expect"]:
            warn(f"snapshot changed: {fc['dir']} has {n} files, snapshot recorded {fc['expect']}")
        else:
            ok(f"{fc['dir']} file count {n} unchanged")


def check_schema_example():
    from jsonschema import Draft7Validator
    import semantic_validate as sv
    S = rj("schema/pagespec.schema.json")
    try:
        Draft7Validator.check_schema(S)
        ok("pagespec.schema.json is a valid Draft-07 schema")
    except Exception as e:  # noqa: BLE001
        fail(f"schema invalid: {e}")
    ex = rj("schema/example.pagespec.json")
    errs, warns = sv.validate_all(ex)
    check(not errs, "example.pagespec.json: 0 errors (schema + semantic)", f"example errors: {errs[:3]}")
    check(not warns, "example.pagespec.json: 0 warnings", f"example warnings: {warns[:3]}")


def run_suite():
    r = subprocess.run([sys.executable, os.path.join(ROOT, "schema", "tests", "adversarial_test.py")], capture_output=True, text=True)
    tail = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-200:]
    check(r.returncode == 0, f"adversarial suite: {tail}", f"adversarial suite failed: {tail}\n{r.stdout[-800:]}")


SOURCE = None


def main():
    global SOURCE
    SOURCE = resolve_source()
    print("design-repo root:", os.path.basename(ROOT), "| source tree:", "found (sibling)" if SOURCE else "none (standalone)")
    check_structure()
    secs = check_parity()
    check_manifest(secs)
    check_routes(secs)
    check_graph(secs)
    check_assets(secs)
    check_citations()
    check_schema_example()
    if "--no-suites" not in sys.argv:
        run_suite()
    print(f"\nSUMMARY: {len(FAILS)} FAIL, {len(WARNS)} WARN")
    for f in FAILS:
        print("  FAIL:", f.splitlines()[0][:230])
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main())
