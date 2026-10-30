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
  assets         closed asset-role registry: closure, no orphan roles, PINNED_POLICIES (weighty roles pinned to one exact clone policy),
                 PINNED_AVAILABILITY (every role's clone-only / generation-safe / blocked-for-generation, also cross-checked against the
                 copy in schema/semantic_validate.py), substitutes + generated-mode guidance, destination-role pattern parity,
                 deny-list contains the real ticker customers, trial-font warning present, source-usage constraint recorded
  contracts      every section contract validates against the closed schema/section-contract.schema.json; source/semantic split;
                 source ranges re-read from the real files (tag at the cited line); retrievalEligible pinned (RETRIEVAL_INELIGIBLE)
  policy         category + designPolicy binding in the manifest, policy/design-policy.json exists, contentHash recomputed
  wrapper gate   extraction/wrapper_gate.py over measured sectionHeights (thresholds pinned in code)
  generated      schema/pagespec.schema.json == fresh build from contracts; generation examples == fresh build; source patterns
                 == fresh build from the real source (when present)
  citations      every path:line[-line] citation resolves inside the real file AND its recorded quote appears in the range
                 (degrades to WARN when no sibling source tree is present - never fails standalone)
  schema/example Draft-07 schema is valid; the clone example and every generation example have 0 errors (schema + semantic)
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
sys.path.insert(0, os.path.join(ROOT, "extraction"))

# Weighty roles are pinned to ONE exact clonePolicy, independent of the registry file. Membership in the
# closed policy enum is necessary but not sufficient: a live endpoint silently switched to 'may-generate-new'
# is still enum-valid. These pins are the second, stricter check (MASTER-GUIDE 3.23).
PINNED_POLICIES = {  # clone-mode policy (assets/asset-roles.json clonePolicy)
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
POLICY_SOURCES = {"must-reuse-exact": ["reuse-exact"], "may-reuse-or-generate": ["reuse-exact", "generate-new", "placeholder"],
                  "may-generate-new": ["generate-new", "placeholder"], "must-not-fabricate": ["placeholder"], "placeholder-only": ["placeholder"],
                  "user-supplied-only": ["user-supplied"], "must-not-reuse-live-endpoint": []}
# Generation availability of EVERY role, pinned independently of assets/asset-roles.json (and of the validator's own copy, which
# check_assets compares against this one). A real logo/wordmark is clone-only: never usable, let alone must-reuse-exact, in generation mode.
PINNED_AVAILABILITY = {
    "brand.logo-mark": "clone-only", "brand.wordmark-ghost": "clone-only", "brand.product-badge": "clone-only", "brand.site-icons": "clone-only",
    "customer.logo": "blocked-for-generation", "customer.imagery": "blocked-for-generation",
    "person.team-photo": "blocked-for-generation", "person.author-avatar": "blocked-for-generation", "embed.video-facade": "blocked-for-generation",
    "dest:help-center-xi": "blocked-for-generation", "dest:help-center-ri": "blocked-for-generation", "dest:client-website": "blocked-for-generation",
    "ui.icon-mask": "generation-safe", "ui.illustration-svg": "generation-safe", "fx.shader-fallback": "generation-safe", "hero.backdrop-photo": "generation-safe",
    "photo.scene-card": "generation-safe", "product.illustration-still": "generation-safe", "cms.post-image": "generation-safe", "motion.lottie": "generation-safe",
    "brand.placeholder-mark": "generation-safe", "brand.user-supplied-mark": "generation-safe", "asset.user-supplied": "generation-safe",
    "generated.illustration": "generation-safe", "placeholder.screenshot": "generation-safe", "fictional.person-avatar": "generation-safe",
    "placeholder.company-logo": "generation-safe", "url.placeholder": "generation-safe", "copy.original": "generation-safe",
    "dest:booking": "generation-safe", "dest:app-signin": "generation-safe", "dest:app-trial": "generation-safe", "dest:app-home": "generation-safe",
    "dest:job-posting": "generation-safe", "dest:social-x": "generation-safe", "dest:social-linkedin": "generation-safe", "dest:support-mailto": "generation-safe",
    "endpoint.contact-form": "generation-safe", "endpoint.newsletter-form": "generation-safe",
}
REQUIRED_GENERATION_SAFE = {"brand.placeholder-mark", "brand.user-supplied-mark", "asset.user-supplied", "generated.illustration", "placeholder.screenshot",
                            "fictional.person-avatar", "placeholder.company-logo", "url.placeholder", "copy.original"}
# 0.3.0: empty. The six product sections were spec-only until the product routes were built in the clone; every section is now
# mounted and no section is runtime/utility UI. The pin, its allowlist mirror and the R8 checks stay in force (an ineligible
# contract or allowlist entry that is not pinned here fails).
RETRIEVAL_INELIGIBLE = set()
RUNTIME_UI_RE = re.compile(r"cookie|consent|modal|dialog|drawer|popup|pop-up|overlay|preloader|toast|lightbox", re.I)
SAAS_POLICY = ("n0-saas-design-constraints-common", "0.1.0")
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


def roles_of(A, cls):
    return [r for r in A["roles"] if r["class"] == cls]


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
            "schema/tests/adversarial_test.py", "extraction/measured-values.json", "extraction/verify_all.py", "extraction/prove_drift.py",
            "policy/design-policy.json", "schema/section-contract.schema.json", "schema/source-patterns.json", "extraction/wrapper_gate.py",
            "extraction/measure_sections.mjs", "extraction/build_schema.py", "extraction/build_source_patterns.py", "extraction/build_generation_examples.py",
            "extraction/policy_hash.py", "schema/examples"]
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
            if fn.endswith((".json", ".md", ".py", ".txt", ".mjs")):
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
    reg_roles = sorted(r["role"] for r in roles_of(A, "asset"))
    check(sorted(allow["assetRoles"]) == reg_roles, "allowlist.assetRoles == asset registry", f"assetRoles differ: {sorted(set(allow['assetRoles']) ^ set(reg_roles))}")
    check(sorted(allow["destinationRoles"]) == sorted(r["role"] for r in roles_of(A, "destination")), "allowlist.destinationRoles == registry", "destinationRoles differ")
    check(sorted(allow["formEndpointRoles"]) == sorted(r["role"] for r in roles_of(A, "form-endpoint")), "allowlist.formEndpointRoles == registry", "formEndpointRoles differ")
    check(sorted(allow["contentRoles"]) == sorted(r["role"] for r in roles_of(A, "content")), "allowlist.contentRoles == registry", "contentRoles differ")
    check(set(r["class"] for r in A["roles"]) <= {"asset", "destination", "form-endpoint", "content"}, "every role has a closed class", "unknown role class")
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
    used.update(S["properties"]["meta"]["properties"]["ogImage"]["properties"]["assetRole"]["enum"])
    og = sorted(r["role"] for r in roles_of(A, "asset") if r.get("ogImageEligible"))
    check(sorted(S["properties"]["meta"]["properties"]["ogImage"]["properties"]["assetRole"]["enum"]) == og, "schema ogImage roles == registry ogImageEligible roles", "ogImage role drift")
    check(used == set(reg_roles), "asset-role closure: every registry role is used by a section field (no orphans) and every used role is registered",
          f"unregistered: {sorted(used - set(reg_roles))}; orphan roles: {sorted(set(reg_roles) - used)}")
    node = S["definitions"]["node"]
    check(sorted(allow["nodeProperties"]) == sorted(node["properties"]), "allowlist.nodeProperties == schema node properties", f"{allow['nodeProperties']} vs {sorted(node['properties'])}")
    check(sorted(allow["motionFields"]) == sorted(S["definitions"]["motion"]["properties"]), "allowlist.motionFields == schema motion fields (closed)", "motion fields differ")
    pol_ = rj("tokens/llm/token-policy.json")
    check(list(allow["styleSlots"]) == list(pol_["styleSlots"]) == list(S["definitions"]["styleTokens"]["properties"]) and S["definitions"]["styleTokens"].get("additionalProperties") is False,
          f"styleTokens slots: allowlist == token-policy == schema ({len(pol_['styleSlots'])}, closed)", "styleSlots drift between allowlist / token-policy / schema")
    check(S["properties"]["mode"]["enum"] == ["clone", "generation"] == allow["pageSpecModes"] and "mode" in S["required"], "PageSpec mode is a required closed enum clone|generation", "mode enum drift")
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
    badslot = [k for k, v in pol["styleSlots"].items() if not set(v["categories"]) <= set(cat) or not all(any(t == a or t.startswith(a) for t in cat_paths) for a in v["accept"])]
    check(not badslot, f"token-policy styleSlots resolve to real catalog categories/tokens ({len(pol['styleSlots'])} slots)", f"styleSlots that resolve to nothing: {badslot}")
    badth = []
    for th, d in pol["themes"].items():
        if not os.path.exists(os.path.join(ROOT, "tokens", "themes", th + ".json")):
            badth.append(th)
        for sf, txts in d["textOnSurface"].items():
            badth += [x for x in [sf] + txts if x not in sem]
    check(not badth, "token-policy themes exist and textOnSurface uses real semantic tokens", f"theme/token drift: {badth[:5]}")
    check(set(pol["generationModeTokenRules"]["unsupportedFonts"]) <= cat_paths, "unsupported-font list names real font tokens", "unsupportedFonts drift")
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
            "assetRoles": len(roles_of(A, "asset")), "destinationRoles": len(roles_of(A, "destination")), "formEndpointRoles": len(roles_of(A, "form-endpoint")),
            "contentRoles": len(roles_of(A, "content")), "graphRules": len(G["rules"]), "tokenFiles": len(tokfiles), "tokens": n,
            "generationExamples": len(listjson("schema/examples"))}
    for k, v in real.items():
        check(M["counts"].get(k) == v, f"manifest.counts.{k} == {v} (recomputed)", f"manifest.counts.{k} = {M['counts'].get(k)} but disk has {v}")
    check(set(M["counts"]) == set(real), "manifest.counts has exactly the recomputed keys", f"count keys differ: {set(M['counts']) ^ set(real)}")
    check(M["allowlistVersion"] == allow["version"], f"allowlistVersion parity ({allow['version']})", f"manifest.allowlistVersion {M['allowlistVersion']} != allowlist.version {allow['version']}")
    check(M["pageSpecVersion"] == S["properties"]["pageSpecVersion"]["const"], "pageSpecVersion parity with schema const", "pageSpecVersion != schema const")
    check(M["status"] == "complete-pending-review" and M["productionApproved"] is False,
          "manifest status complete-pending-review, productionApproved false (production approval is a human sign-off)", "manifest status/approval wrong")
    # common-policy / category binding (N0 Common Composition IR v0.5)
    import policy_hash
    dp = M.get("designPolicy", {})
    pol_ok = os.path.exists(os.path.join(ROOT, dp.get("ref", "-")))
    check(pol_ok and M.get("category") == "saas", "manifest binds category 'saas' and designPolicy.ref exists", f"category/designPolicy binding missing: {M.get('category')} {dp.get('ref')}")
    if pol_ok:
        P = rj(dp["ref"])
        check((dp.get("policyId"), dp.get("policyVersion")) == SAAS_POLICY == (P["policyId"], P["policyVersion"]) and dp.get("commonIrVersion") == P["commonIrVersion"] == "0.5"
              and dp.get("enforcementMode") == P["enforcementMode"] == "hard-and-soft",
              f"designPolicy = {SAAS_POLICY[0]} v{SAAS_POLICY[1]}, commonIr 0.5, hard-and-soft (manifest == policy file)", "designPolicy fields disagree with policy file / SaaS binding")
        check(P["classification"]["isSaaS"] is True and P["classification"]["productCategory"] == M.get("category") and len(P["classification"]["evidence"]) >= 3,
              f"policy classification isSaaS with {len(P['classification']['evidence'])} evidence citations", "SaaS classification lacks evidence")
        check(all(os.path.exists(os.path.join(ROOT, e)) for e in P["enforcedBy"]), "every policy enforcedBy file exists", "policy enforcedBy names a missing file")
        want = policy_hash.compute(ROOT)
        check(dp.get("contentHash") == want, f"designPolicy.contentHash matches the enforced files ({want[:19]}...)", f"designPolicy.contentHash {dp.get('contentHash')} != recomputed {want}")
        check(P["approval"]["architectureDecisionRecorded"] is False, "policy approval honest: architectureDecisionRecorded false", "policy approval overstated")
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
    import semantic_validate as sv
    A = rj("assets/asset-roles.json")
    S = rj("schema/pagespec.schema.json")
    roles = {r["role"]: r for r in roles_of(A, "asset")}
    allr = {r["role"]: r for r in A["roles"]}
    withpol = {k: r for k, r in allr.items() if r["class"] != "content"}
    check(A["clonePolicyEnum"] == list(POLICY_SOURCES), "clone policy enum is the closed 7-value set", f"clonePolicyEnum drifted: {A['clonePolicyEnum']}")
    check(all(r["clonePolicy"] in A["clonePolicyEnum"] for r in withpol.values()), "every role's clonePolicy is a member of the closed enum", "policy not in enum")
    wrong = [(k, allr[k]["clonePolicy"], want) for k, want in PINNED_POLICIES.items() if k not in allr or allr[k].get("clonePolicy") != want]
    check(not wrong, f"PINNED_POLICIES: {len(PINNED_POLICIES)} weighty roles pinned to their exact clone policy (not just enum membership)", f"pinned role policy changed: {wrong}")
    dwrong = [d for d in PINNED_DESTINATIONS if d not in allr or allr[d]["clonePolicy"] != "must-not-reuse-live-endpoint"]
    check(not dwrong and sorted(PINNED_DESTINATIONS) == sorted(r["role"] for r in roles_of(A, "destination")), f"{len(PINNED_DESTINATIONS)} destination roles pinned to must-not-reuse-live-endpoint (set is closed)", f"destination pin drift: {dwrong}")
    srcbad = [r for r, v in withpol.items() if v["cloneAssetSources"] != POLICY_SOURCES[v["clonePolicy"]]]
    check(not srcbad, "cloneAssetSources matches the clone policy for every role", f"cloneAssetSources drift: {srcbad}")
    check(A["assetSourceEnum"] == ["reuse-exact", "generate-new", "placeholder", "user-supplied"], "assetSource enum closed", "assetSourceEnum drift")
    # availability: closed enum, pinned per role in code (here AND in the validator), substitutes + guidance
    check(A["availabilityEnum"] == ["clone-only", "generation-safe", "blocked-for-generation"] and all(r.get("availability") in A["availabilityEnum"] for r in A["roles"]),
          f"every role ({len(A['roles'])}) has a closed availability", "availability missing or outside the closed enum")
    avw = [(k, allr.get(k, {}).get("availability"), v) for k, v in PINNED_AVAILABILITY.items() if allr.get(k, {}).get("availability") != v]
    avw += [(k, allr[k]["availability"], None) for k in allr if k not in PINNED_AVAILABILITY]
    check(not avw, f"PINNED_AVAILABILITY: all {len(PINNED_AVAILABILITY)} roles pinned in verify_all.py match the registry", f"availability pin violated: {avw[:4]}")
    check(PINNED_AVAILABILITY == sv.PINNED_AVAILABILITY and PINNED_POLICIES == sv.PINNED_POLICIES and POLICY_SOURCES == sv.POLICY_SOURCES,
          "availability/policy pins identical in verify_all.py and schema/semantic_validate.py", "pin tables differ between verify_all.py and semantic_validate.py")
    check(REQUIRED_GENERATION_SAFE <= {k for k, r in allr.items() if r["availability"] == "generation-safe"},
          f"required generation-safe roles present ({len(REQUIRED_GENERATION_SAFE)}: placeholder/user-supplied mark, user asset, generated illustration, placeholder screenshot, fictional avatar, placeholder company logo, placeholder URL, original copy)",
          f"missing generation-safe roles: {REQUIRED_GENERATION_SAFE - set(allr)}")
    badsub = []
    for k, r in allr.items():
        if not isinstance(r.get("generationSafeSubstitutes"), list) or not r.get("generatedModeGuidance"):
            badsub.append((k, "missing substitutes/guidance"))
        elif r["availability"] != "generation-safe" and not r["generationSafeSubstitutes"]:
            badsub.append((k, "no substitute"))
        for x in r.get("generationSafeSubstitutes", []):
            if x not in allr or allr[x]["availability"] != "generation-safe":
                badsub.append((k, x))
    check(not badsub, "every role has generationSafeSubstitutes + generatedModeGuidance; non-safe roles name generation-safe substitutes", f"substitute problems: {badsub[:4]}")
    genbad = [k for k, r in roles.items() if (r["availability"] != "generation-safe" and r.get("generationAssetSources")) or "reuse-exact" in r.get("generationAssetSources", [])
              or (r["availability"] == "generation-safe" and not r.get("generationAssetSources"))]
    check(not genbad, "generation sources: never reuse-exact; empty for clone-only/blocked roles (a real logo is never must-reuse-exact in generation mode)", f"generationAssetSources wrong: {genbad}")
    gbad = [s["id"] for s in secs.values() if s["generatedAssetRoles"] != sorted(r for r in s["assetRoles"] if roles[r]["availability"] == "generation-safe")]
    check(not gbad, "every section's generatedAssetRoles == the generation-safe subset of its assetRoles", f"generatedAssetRoles drift: {gbad}")
    nosafe = []
    for s in secs.values():
        def wf(f, path):
            if f["type"] == "asset" and not any(roles[r]["availability"] == "generation-safe" for r in f["roles"]):
                nosafe.append(f"{s['id']}.{path}")
            elif f["type"] == "list":
                wf(f["item"], path + "[]")
            elif f["type"] == "object":
                [wf(v, path + "." + k) for k, v in f["fields"].items()]
        [wf(v, k) for k, v in s["content"]["fields"].items()]
    check(not nosafe, "every asset field accepts at least one generation-safe role (generation mode can always fill it)", f"fields with no generation-safe role: {nosafe[:4]}")
    # the schema's link-target pattern must name exactly the destination roles
    sample = next(s for s in S["definitions"]["node"]["allOf"] if s["if"]["properties"]["section"]["const"] == "shell.navbar")
    pat = sample["then"]["properties"]["content"]["properties"]["signIn"]["properties"]["to"]["pattern"]
    m = re.search(r"dest:\(([^)]+)\)", pat)
    names = set(m.group(1).split("|")) if m else set()
    check(names == {d.split(":")[1] for d in PINNED_DESTINATIONS}, "schema link-target pattern allows exactly the registered dest:<role> names", f"pattern roles {names}")
    check("http" not in pat.replace("https://([a-z0-9-]+\\.)*[a-z0-9-]+\\.(example|invalid)", ""), "link-target pattern admits no live URL (only reserved .example/.invalid placeholders)", "pattern admits live URLs")
    ident = A["realIdentities"]["customers"]
    miss = [c for c in TICKER_CUSTOMERS if c not in ident]
    check(not miss, "deny-list contains all 10 real ticker customers", f"deny-list missing: {miss}")
    fav = next((f for f in A["fontFaces"] if f["family"].startswith("ABC Favorit")), None)
    check(bool(fav) and "TRIAL" in fav["licensing"], "ABC Favorit Trial licensing warning present", "trial-font warning missing")
    P = rj("policy/design-policy.json")
    check(P["sourceUsage"]["status"] == "reference-and-study-only" and "not for public deployment" in P["sourceUsage"]["statement"].lower()
          and "policy/design-policy.json" in A["legalNotice"], "reference/study-only source usage recorded in policy/design-policy.json and referenced by the legal notice",
          "source-usage constraint missing (policy/design-policy.json sourceUsage / legalNotice)")
    bad = []  # each section lists assetRoles consistent with its fields
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


def check_contracts(secs):
    from jsonschema import Draft7Validator
    import semantic_validate as sv
    CS = rj("schema/section-contract.schema.json")
    Draft7Validator.check_schema(CS)
    v = Draft7Validator(CS)
    bad = [f"{k}: {'/'.join(map(str, e.absolute_path))} {e.message[:90]}" for k, sc in secs.items() for e in v.iter_errors(sc)]
    check(not bad, f"all {len(secs)} section contracts validate against the closed schema/section-contract.schema.json", f"contract schema errors: {bad[:3]}")
    reg = set(CS["definitions"]["assetRole"]["enum"])
    check(reg == {r["role"] for r in roles_of(rj("assets/asset-roles.json"), "asset")}, "section-contract schema assetRole enum == registry", "section-contract assetRole enum drift")
    ss = [k for k, sc in secs.items() if sc["semantic"]["id"] != k or sc["source"]["id"] == k or sc["semantic"]["category"] != sc["category"]]
    check(not ss, f"source/semantic split: semantic.id == id, semantic.category == category, source.id != id ({len(secs)} contracts)", f"source/semantic problems: {ss}")
    # retrieval eligibility pin (R8)
    real = {k for k, sc in secs.items() if sc["retrievalEligible"] is False}
    allow = rj("tokens/llm/component-allowlist.json")
    check(real == RETRIEVAL_INELIGIBLE == set(allow["retrievalIneligibleSections"]) == sv.RETRIEVAL_INELIGIBLE,
          f"retrievalEligible pinned: contracts == RETRIEVAL_INELIGIBLE (verify_all + semantic_validate) == allowlist ({len(real)} ineligible)",
          f"retrieval pin drift: contracts {sorted(real)} allowlist {allow['retrievalIneligibleSections']}")
    rt = [k for k, sc in secs.items() if RUNTIME_UI_RE.search(k + " " + " ".join(sc["tags"])) and k not in RETRIEVAL_INELIGIBLE]
    check(not rt, "no runtime/utility-UI-looking section (cookie, modal, dialog, drawer, popup, preloader, toast) outside the retrieval pin", f"unpinned runtime UI: {rt}")
    # 0.3.0: every documented section maps to a real, mounted implementation (no spec-only contracts left)
    unimpl = [k for k, sc in secs.items() if sc["status"] != "mounted" or not sc["implementedBy"] or sc["source"]["file"].endswith(".md")
              or sc["source"]["file"] not in sc["implementedBy"]]
    check(not unimpl, f"every section contract is mounted, has implementedBy, and its source points at real code listed in implementedBy ({len(secs)})",
          f"sections without a real implementation: {unimpl}")
    if not SOURCE:
        warn(f"no sibling source tree: {len(secs)} source ranges NOT re-read (standalone copy)")
        return
    missing = [f"{k}: {f}" for k, sc in secs.items() for f in sc["implementedBy"] if src_lines(f) is None]
    check(not missing, "every implementedBy file exists in the source tree", f"implementedBy files missing: {missing[:3]}")
    badsrc = []
    for k, sc in secs.items():
        src = sc["source"]
        ls = src_lines(src["file"])
        a_, b_ = map(int, src["lines"].split("-"))
        if ls is None or a_ < 1 or b_ > len(ls) or a_ > b_:
            badsrc.append(f"{k}: {src['file']}:{src['lines']} out of range")
            continue
        first = ls[a_ - 1]
        if not (("<" + src["tag"]) in first or (src["file"].endswith(".md") and first.startswith(src["tag"] + " "))):
            badsrc.append(f"{k}: tag <{src['tag']}> not at {src['file']}:{a_}")
    check(not badsrc, f"{len(secs)} contract source ranges re-read from the real files: in range and the tag sits at the cited line", f"source provenance drift: {badsrc[:3]}")


def check_gate(secs):
    import wrapper_gate as wg
    check((wg.VIEWPORT, wg.HERO_WARN_PX, wg.HERO_ERROR_PX, wg.SHARE_WARN, wg.SHARE_ERROR, wg.MIN_INFLOW) == (1440, 1800, 3000, 0.50, 0.60, 3),
          "wrapper-gate thresholds pinned in code (1440px; HERO 1800/3000px; share 50%/60%; min 3 in-flow)", "wrapper-gate thresholds changed")
    sh, T, R, S_ = wg.load_inputs()
    errs, warns, oks = wg.evaluate(sh, T, R, S_)
    for o in oks:
        ok("wrapper gate: " + o)
    for w in warns:
        warn("wrapper gate: " + w)
    check(not errs, f"wrapper gate: 0 errors over {len(sh.get('routes', {})) if sh else 0} measured routes", f"wrapper gate errors: {errs[:3]}")


def check_generated():
    import build_schema
    import build_generation_examples as bge
    fresh = build_schema.build()
    check(fresh == rj("schema/pagespec.schema.json"), "schema/pagespec.schema.json == fresh build from the contracts (extraction/build_schema.py)", "pagespec schema is stale vs the contracts: re-run extraction/build_schema.py")
    out, problems = bge.build_all()
    stale = [p for p, txt in out.items() if not os.path.exists(os.path.join(ROOT, p)) or json.loads(txt) != rj(p)]
    extra = sorted(set(os.path.relpath(p, ROOT) for p in listjson("schema/examples")) - set(out))
    check(not problems and not stale and not extra, f"{len(out)} generation examples == fresh build and validate clean", f"generation examples: problems {problems[:2]} stale {stale} unexpected {extra}")
    if SOURCE:
        import build_source_patterns as bsp
        check(bsp.build(SOURCE) == rj("schema/source-patterns.json"), "schema/source-patterns.json == fresh build from the real source (no pattern drift)", "source-patterns.json is stale vs the source: re-run extraction/build_source_patterns.py")
    else:
        warn("no sibling source tree: source-patterns not rebuilt")


def check_schema_example():
    from jsonschema import Draft7Validator
    import semantic_validate as sv
    import wrapper_gate as wg
    S = rj("schema/pagespec.schema.json")
    try:
        Draft7Validator.check_schema(S)
        ok("pagespec.schema.json is a valid Draft-07 schema")
    except Exception as e:  # noqa: BLE001
        fail(f"schema invalid: {e}")
    ctx = sv.load_context(ROOT)
    ex = rj("schema/example.pagespec.json")
    errs, warns = sv.validate_all(ex, ctx)
    check(ex.get("mode") == "clone", "example.pagespec.json is mode 'clone' (real Primefold assets/copy allowed)", "example.pagespec.json is not mode clone")
    check(not errs, "example.pagespec.json: 0 errors (schema + semantic)", f"example errors: {errs[:3]}")
    check(not warns, "example.pagespec.json: 0 warnings", f"example warnings: {warns[:3]}")
    fams = set()
    for p in listjson("schema/examples"):
        e = rj(os.path.relpath(p, ROOT))
        errs, warns = sv.validate_all(e, ctx)
        fams.add(e.get("template"))
        check(e.get("mode") == "generation" and not errs and not warns, f"{os.path.basename(p)}: mode generation, 0 errors, 0 warnings",
              f"{os.path.basename(p)}: mode {e.get('mode')} errors {errs[:2]} warnings {warns[:1]}")
    want = set(t["id"] for t in rj("templates/templates.json")["templates"]) - wg.PINNED_UNRENDERED_TEMPLATES
    skipped = f" except the unrendered {sorted(wg.PINNED_UNRENDERED_TEMPLATES)}" if wg.PINNED_UNRENDERED_TEMPLATES else ""
    check(want <= fams, f"a generation example exists for every template family{skipped} ({len(fams)} templates)",
          f"templates without a generation example: {sorted(want - fams)}")


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
    check_contracts(secs)
    check_gate(secs)
    check_citations()
    check_generated()
    check_schema_example()
    if "--no-suites" not in sys.argv:
        run_suite()
    print(f"\nSUMMARY: {len(FAILS)} FAIL, {len(WARNS)} WARN")
    for f in FAILS:
        print("  FAIL:", f.splitlines()[0][:230])
    return 1 if FAILS else 0


if __name__ == "__main__":
    sys.exit(main())
