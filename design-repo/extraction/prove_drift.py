#!/usr/bin/env python3
"""prove_drift.py - proves extraction/verify_all.py actually FAILS on drift (and passes on the real repo).

For each scenario this script copies the whole design-repo to a scratch directory, injects ONE defect, runs the
copy's own extraction/verify_all.py, and requires a non-zero exit with the expected message. A control copy with no
defect must pass. The real repo is never modified.

Citation scenarios need the source tree: it is taken from --source, $DESIGN_REPO_SOURCE_ROOT, or the repo's parent
directory when that looks like the source project (package.json + src/). Without it those scenarios are SKIPPED, loudly.

Usage: python3 extraction/prove_drift.py [--source DIR]     (scratch dirs come from the OS temp dir; set TMPDIR to override)
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def source_root():
    if "--source" in sys.argv:
        return sys.argv[sys.argv.index("--source") + 1]
    if os.environ.get("DESIGN_REPO_SOURCE_ROOT"):
        return os.environ["DESIGN_REPO_SOURCE_ROOT"]
    parent = os.path.dirname(ROOT)
    return parent if os.path.exists(os.path.join(parent, "package.json")) and os.path.isdir(os.path.join(parent, "src")) else None


SRC = source_root()


def edit_json(root, rel, fn):
    p = os.path.join(root, rel)
    d = json.load(open(p, encoding="utf-8"))
    fn(d)
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)


def edit_text(root, rel, fn):
    p = os.path.join(root, rel)
    s = open(p, encoding="utf-8").read()
    open(p, "w", encoding="utf-8").write(fn(s))


def role(d, name, **kw):
    for r in d["assetRoles"] + d["destinationRoles"] + d["formEndpointRoles"]:
        if r["role"] == name:
            r.update(kw)
            return
    raise KeyError(name)


# (name, needs_source, mutate(copy_root), expected substring in verify_all output)
def scenarios():
    S = []

    def add(name, needs_src, fn, expect):
        S.append((name, needs_src, fn, expect))

    add("phantom allowlist entry (id with no contract file)", False,
        lambda r: edit_json(r, "tokens/llm/component-allowlist.json", lambda d: d["sections"].append("hero.phantom")), "allowlist.sections: phantom entries")
    add("orphan contract (allowlist entry deleted)", False,
        lambda r: edit_json(r, "tokens/llm/component-allowlist.json", lambda d: d["components"].remove("component.info-card")), "orphan contracts")
    add("manifest count wrong (sections: 99)", False,
        lambda r: edit_json(r, "registry.manifest.json", lambda d: d["counts"].__setitem__("sections", 99)), "manifest.counts.sections")
    add("manifest count wrong (routes: 28)", False,
        lambda r: edit_json(r, "registry.manifest.json", lambda d: d["counts"].__setitem__("routes", 28)), "manifest.counts.routes")
    add("allowlistVersion drifted from allowlist.version", False,
        lambda r: edit_json(r, "registry.manifest.json", lambda d: d.__setitem__("allowlistVersion", "9.9.9")), "allowlistVersion")
    add("entryPoint pointing outside the package (../ia.json)", False,
        lambda r: edit_json(r, "registry.manifest.json", lambda d: d["entryPoints"].append("../ia.json")), "bad entryPoints")
    add("README count table stale", False,
        lambda r: edit_text(r, "README.md", lambda s: s.replace("| sections (contracts) | 34 |", "| sections (contracts) | 30 |")), "README counts stale")
    add("absolute local path leaked into a file", False,
        lambda r: edit_text(r, "README.md", lambda s: s + "\nBuilt in /Us" + "ers/someone/work/design-repo\n"), "absolute paths")
    add("documented script that does not exist (drift-proof script referenced but missing)", False,
        lambda r: edit_text(r, "README.md", lambda s: s + "\nSee scripts/prove_d" + "rift" + ".s" + "h for the proof.\n"), "documented but missing")
    add("route removed (coverage gap)", False,
        lambda r: edit_json(r, "templates/routes.json", lambda d: d["routes"].pop()), "route/template list mismatch")
    add("route assigned to a different template than templates[].routes says", False,
        lambda r: edit_json(r, "templates/routes.json", lambda d: d["routes"][1].__setitem__("template", "template.home")), "route binding disagrees")
    add("retrievalEligible flipped on a route", False,
        lambda r: edit_json(r, "templates/routes.json", lambda d: d["routes"][1].__setitem__("retrievalEligible", True)), "retrievalEligible inconsistencies")
    add("graph rule deleted but validator still implements it", False,
        lambda r: edit_json(r, "compatibility/graph.json", lambda d: d["rules"].pop(0)), "graph/validator divergence")
    add("named category exception removed (graph no longer matches real templates)", False,
        lambda r: edit_json(r, "compatibility/graph.json", lambda d: next(x for x in d["rules"] if x["id"] == "NO_ADJACENT_SAME_CATEGORY")["exceptions"].pop()), "exception drift")
    add("schema assetRole enum loses a registered role", False,
        lambda r: edit_json(r, "schema/pagespec.schema.json", lambda d: d["definitions"]["assetRole"]["enum"].remove("customer.logo")), "closed enum")
    add("PINNED ROLE: customer.logo moved to a different-but-valid policy (may-generate-new)", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: role(d, "customer.logo", generationPolicy="may-generate-new", allowedAssetSources=["generate-new", "placeholder"])), "pinned role policy changed")
    add("PINNED ROLE: endpoint.contact-form moved to may-generate-new", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: role(d, "endpoint.contact-form", generationPolicy="may-generate-new", allowedAssetSources=["generate-new", "placeholder"])), "pinned role policy changed")
    add("PINNED ROLE: person.team-photo moved to may-generate-new", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: role(d, "person.team-photo", generationPolicy="may-generate-new", allowedAssetSources=["generate-new", "placeholder"])), "pinned role policy changed")
    add("PINNED ROLE: dest:booking moved to must-reuse-exact", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: role(d, "dest:booking", generationPolicy="must-reuse-exact", allowedAssetSources=["reuse-exact"])), "pin")
    add("policy value outside the closed enum", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: role(d, "ui.icon-mask", generationPolicy="anything-goes")), "enum")
    add("link-target pattern admits literal URLs", False,
        lambda r: edit_text(r, "schema/pagespec.schema.json", lambda s: s.replace("^(/[A-Za-z0-9/._~#-]*|", "^(https?://.*|/[A-Za-z0-9/._~#-]*|")), "pattern")
    add("deny-list loses a real ticker customer", False,
        lambda r: edit_json(r, "assets/asset-roles.json", lambda d: d["realIdentities"]["customers"].remove("SirPlus")), "deny-list")
    add("token catalog gains a phantom token", False,
        lambda r: edit_json(r, "tokens/llm/token-catalog.json", lambda d: d["categories"]["color"].append("color.neon-pink")), "catalog phantom")
    add("semantic token reference to a missing foundation token", False,
        lambda r: edit_text(r, "tokens/10-semantic/semantic.json", lambda s: s.replace("{color.ink-2}", "{color.ink-9}", 1)), "unresolved")
    add("example PageSpec breaks the schema", False,
        lambda r: edit_json(r, "schema/example.pagespec.json", lambda d: d.__setitem__("template", "template.landing")), "example")

    def oor(d):
        e = next(c for c in d["citations"] if c["path"] == "CLONE_SPEC.md")
        e["lines"] = "99990-99999"

    add("OUT-OF-RANGE citation (beyond end of file)", True, lambda r: edit_json(r, "extraction/measured-values.json", oor), "exceeds file length")

    def wrong(d):
        e = next(c for c in d["citations"] if c["path"] == "src/components/Footer.jsx" and len(c["quote"]) > 8)
        e["lines"] = "1"

    add("IN-RANGE-BUT-WRONG citation (valid line, wrong code)", True, lambda r: edit_json(r, "extraction/measured-values.json", wrong), "in-range but wrong")

    def phantom_source(d):
        d["citations"].append({"owner": "x", "path": "src/does/not/exist.jsx", "lines": "1-2", "quote": "x"})

    add("citation to a file that does not exist", True, lambda r: edit_json(r, "extraction/measured-values.json", phantom_source), "missing")

    def absence(d):
        d["absences"][0]["pattern"] = "import"   # every file imports something -> claim becomes false

    add("false 'absent' claim (reduced-motion handling claimed missing but present)", True, lambda r: edit_json(r, "extraction/measured-values.json", absence), "absence claim false")
    return S


def run_verify(root, with_src, suites=False):
    cmd = [sys.executable, os.path.join(root, "extraction", "verify_all.py")]
    if with_src and SRC:
        cmd += ["--source", SRC]
    if not suites:
        cmd.append("--no-suites")
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=os.path.dirname(root))
    return r.returncode, r.stdout + r.stderr


def main():
    scratch = tempfile.mkdtemp(prefix="drift-proof-")
    results = []
    try:
        base = os.path.join(scratch, "control", "design-repo")
        shutil.copytree(ROOT, base, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))
        rc, out = run_verify(base, True, suites=True)
        results.append(("CONTROL: unmodified copy passes verify_all.py (incl. adversarial suite)", rc == 0, "" if rc == 0 else out[-600:]))
        for i, (name, needs_src, fn, expect) in enumerate(scenarios()):
            if needs_src and not SRC:
                results.append((name, None, "SKIPPED: no source tree available"))
                continue
            d = os.path.join(scratch, f"s{i}", "design-repo")
            shutil.copytree(ROOT, d, ignore=shutil.ignore_patterns("__pycache__", ".DS_Store"))
            fn(d)
            rc, out = run_verify(d, True)
            hit = rc != 0 and expect.lower() in out.lower()
            results.append((name, hit, "" if hit else f"rc={rc}; expected {expect!r}; tail: {out[-400:]}"))
        rc, out = run_verify(ROOT, True, suites=False)
        results.append(("REAL repo still passes after all scratch experiments", rc == 0, "" if rc == 0 else out[-600:]))
    finally:
        shutil.rmtree(scratch, ignore_errors=True)
    bad = 0
    for name, ok, note in results:
        tag = "SKIP" if ok is None else ("PASS" if ok else "FAIL")
        bad += ok is False
        print(f"{tag}  {name}" + (f"\n      {note}" if note else ""))
    n = sum(1 for r in results if r[1] is not None)
    print(f"\n{n - bad}/{n} drift-proof checks behaved correctly ({sum(1 for r in results if r[1] is None)} skipped)")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
