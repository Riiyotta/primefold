#!/usr/bin/env python3
"""build_source_patterns.py - derives the generation-mode leakage patterns from the REAL source.

Reads the sibling source tree (src/, index.html, specs/, CLONE_SPEC.md, public/) and writes schema/source-patterns.json,
which schema/semantic_validate.py uses for the GENERATION_MODE_* rules. Every entry carries file:line evidence; a seed
term that cannot be found in the source makes the build FAIL (nothing is invented).

  python3 extraction/build_source_patterns.py [--source DIR]          # rewrite schema/source-patterns.json
  python3 extraction/build_source_patterns.py [--source DIR] --check  # exit 1 if the file differs from a fresh build

Categories: brand (names/variants/product names), urls (literal URLs + hosts), people, customers, claims (statistics),
embeds (video hosts), assetFiles (every public/ file name, so an assetRef cannot smuggle a source file under another
prefix), screenshotFiles (product stills / editorial covers), copyShingles (sha256 of normalised 5-word runs of source
copy; the copy itself is NOT stored). Strings are normalised first (NFKC, zero-width removal, curly quotes, dashes).

Detection is string-based. It catches verbatim and lightly-disguised reuse; it cannot catch paraphrase. No human has
reviewed these patterns.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "schema"))
import semantic_validate as sv  # noqa: E402  (normalise / shingles live in the validator so both sides agree)

# Seed terms: each must be found verbatim in the source (evidence recorded); (term, caseSensitive).
BRAND_SEEDS = [("Primefold", False), ("Saypien", False), ("Experience Intelligence", False), ("Real Estate Intelligence", False),
               ("Insight Hub", False), ("Primefold XI", False), ("Primefold RI", False), ("XI", True), ("RI", True)]
EMBED_HOSTS = ["youtube.com", "youtube-nocookie.com", "youtu.be", "i.ytimg.com"]
LOREM = set("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad "
            "minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit "
            "voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia "
            "deserunt mollit anim id est laborum".split())
URL_RE = re.compile(r"https?://[^\s\"'`)<>\\]+")


def source_root():
    if "--source" in sys.argv:
        return sys.argv[sys.argv.index("--source") + 1]
    if os.environ.get("DESIGN_REPO_SOURCE_ROOT"):
        return os.environ["DESIGN_REPO_SOURCE_ROOT"]
    parent = os.path.dirname(ROOT)
    return parent if os.path.exists(os.path.join(parent, "package.json")) and os.path.isdir(os.path.join(parent, "src")) else None


def files(src):
    out = sorted(os.path.relpath(p, src) for p in glob.glob(os.path.join(src, "src", "**", "*"), recursive=True) if p.endswith((".js", ".jsx")))
    return out + ["index.html"]


def lines_of(src, rel):
    return open(os.path.join(src, rel), encoding="utf-8", errors="replace").read().split("\n")


def find(src, rels, needle, case=False):
    for rel in rels:
        for i, l in enumerate(lines_of(src, rel), 1):
            if (needle in l) if case else (needle.lower() in l.lower()):
                return f"{rel}:{i}"
    return None


def build(src):
    code = files(src)
    docs = code + ["CLONE_SPEC.md"] + sorted(os.path.relpath(p, src) for p in glob.glob(os.path.join(src, "specs", "*.md"))) + ["public/assets/MANIFEST.md"]
    missing = []
    brand = []
    for term, case in BRAND_SEEDS:
        ev = find(src, docs, term, case)
        if not ev:
            missing.append(term)
            continue
        brand.append({"term": term, "caseSensitive": case, "evidence": ev})
    # literal URLs and hosts (the SVG namespace is not a destination)
    urls, hosts = {}, {}
    for rel in code:
        for i, l in enumerate(lines_of(src, rel), 1):
            for m in URL_RE.finditer(l):
                u = m.group(0).rstrip(".,;")
                if "w3.org" in u:
                    continue
                key = re.sub(r"^https?://(www\.)?", "", u).rstrip("/").lower()
                urls.setdefault(key, f"{rel}:{i}")
                h = key.split("/")[0]
                hosts.setdefault(h, f"{rel}:{i}")
    # people
    people = {}
    team = "src/pages/company/Team.jsx"
    for i, l in enumerate(lines_of(src, team), 1):
        m = re.match(r"\s*\['([^']+)', '([^']+)', '[^']+'\],", l)
        if m:
            people.setdefault(m.group(1), {"name": m.group(1), "kind": "first-name", "evidence": f"{team}:{i}"})
    for rel, rx in [("src/components/Testimonials.jsx", r"name: '([^']+)'"), ("src/pages/cms/data.js", r'"author": "([^"]+)"')]:
        for i, l in enumerate(lines_of(src, rel), 1):
            for m in re.finditer(rx, l):
                people.setdefault(m.group(1), {"name": m.group(1), "kind": "full-name", "evidence": f"{rel}:{i}"})
    dl = lines_of(src, "src/pages/cms/data.js")
    for i, l in enumerate(dl, 1):
        if '"author": {' in l:
            m = re.search(r'"name": "([^"]+)"', dl[i])
            if m:
                people.setdefault(m.group(1), {"name": m.group(1), "kind": "full-name", "evidence": f"src/pages/cms/data.js:{i + 1}"})
    # customers
    cust = {}
    for rel, rx in [("src/components/HowItWorks.jsx", r"'([^']+?) logo'\]"), ("src/components/Testimonials.jsx", r"logoAlt: '([^']+?) logo'"),
                    ("src/components/Outcomes.jsx", r"logoAlt: '([^']+?) logo'")]:
        for i, l in enumerate(lines_of(src, rel), 1):
            for m in re.finditer(rx, l):
                if m.group(1) != "Customer":
                    cust.setdefault(m.group(1), f"{rel}:{i}")
    for i, l in enumerate(dl, 1):
        if '"client": {' in l:
            m = re.search(r'"name": "([^"]+)"', dl[i])
            if m:
                cust.setdefault(m.group(1), f"src/pages/cms/data.js:{i + 1}")
    if "t3n digital pioneers" in cust:
        cust.setdefault("t3n", cust["t3n digital pioneers"])
    customers = [{"name": k, "caseSensitive": bool(re.fullmatch(r"[A-Z0-9]{2,5}", k)), "evidence": v} for k, v in sorted(cust.items())]
    # claims: outcome numbers, company stats, case-study stat values (bare 1-2 digit integers are too generic to own)
    claims = {}
    for rel, rx in [("src/components/Outcomes.jsx", r"num: '([^']+)'"), ("src/pages/company/CompanyHero.jsx", r"value: '([^']+)'"),
                    ("src/pages/cms/data.js", r'"value": "([^"]+)"')]:
        for i, l in enumerate(lines_of(src, rel), 1):
            for m in re.finditer(rx, l):
                v = m.group(1)
                if re.search(r"\d", v) and not re.fullmatch(r"\d{1,2}", v):
                    claims.setdefault(sv.normalise(v), {"value": v, "evidence": f"{rel}:{i}"})
    embeds = []
    for h in EMBED_HOSTS:
        ev = find(src, docs, h.split(".")[0] if h != "i.ytimg.com" else "i.ytimg.com")
        if ev:
            embeds.append({"host": h, "evidence": ev})
    # asset files
    pub = sorted(os.path.relpath(p, os.path.join(src, "public")) for p in glob.glob(os.path.join(src, "public", "**", "*"), recursive=True)
                 if os.path.isfile(p) and not p.endswith(".md"))
    stems = sorted({os.path.splitext(os.path.basename(p))[0] for p in pub})
    A = json.load(open(os.path.join(ROOT, "assets/asset-roles.json"), encoding="utf-8"))
    shots = sorted({os.path.splitext(os.path.basename(f))[0] for r in A["roles"] if r["role"] in ("product.illustration-still", "cms.post-image") for f in r.get("realFiles", [])})
    # copy shingles from string literals and JSX text
    sh = set()
    lit = re.compile(r"'((?:[^'\\\n]|\\.){12,})'|\"((?:[^\"\\\n]|\\.){12,})\"|`([^`]{12,})`|>([^<>{}\n]{12,})<")
    nsrc = 0
    for rel in code:
        text = open(os.path.join(src, rel), encoding="utf-8", errors="replace").read()
        for m in lit.finditer(text):
            s = next(g for g in m.groups() if g)
            s = re.sub(r"<[^>]+>", " ", s)
            if "className" in s or re.search(r"\b(?:[a-z]+:)?[a-z]+-\[", s) or s.count("-") > len(s.split()) or "/" in s.split()[0]:
                continue
            ws = sv.words_of(s)
            if len(ws) < 5 or sum(w in LOREM for w in ws) > len(ws) / 2:
                continue
            nsrc += 1
            sh.update(sv.shingles(s))
    if missing:
        raise SystemExit(f"FAIL seed terms not found in the source (nothing may be invented): {missing}")
    return {
        "$description": "GENERATED by extraction/build_source_patterns.py from the real source tree - do not hand-edit. Used by schema/semantic_validate.py "
                        "GENERATION_MODE_* rules. Every entry has file:line evidence. Detection is string-based (verbatim / lightly disguised reuse, "
                        "not paraphrase); no human has reviewed these patterns.",
        "normalisation": "NFKC; zero-width chars removed; curly quotes -> straight; en/em/figure dashes and minus -> '-'; whitespace collapsed; matching is case-insensitive unless caseSensitive",
        "brand": brand,
        "urls": [{"value": k, "evidence": v} for k, v in sorted(urls.items())],
        "hosts": [{"host": k, "evidence": v} for k, v in sorted(hosts.items())],
        "people": sorted(people.values(), key=lambda p: p["name"]),
        "customers": customers,
        "claims": sorted(claims.values(), key=lambda c: c["value"]),
        "embeds": embeds,
        "assetFiles": {"count": len(stems), "stems": stems, "evidence": "public/** file names (excluding *.md)"},
        "screenshotFiles": shots,
        "copyShingles": {"algorithm": "sha256(normalised lower-case 5-word window)[:16]", "window": sv.SHINGLE_N, "sourceStrings": nsrc,
                         "count": len(sh), "hashes": sorted(sh)},
    }


def main():
    src = source_root()
    if not src:
        print("WARN no source tree: source-patterns not rebuilt (standalone copy)")
        return 0
    out = json.dumps(build(src), indent=1, ensure_ascii=False) + "\n"
    path = os.path.join(ROOT, "schema", "source-patterns.json")
    if "--check" in sys.argv:
        same = os.path.exists(path) and json.load(open(path, encoding="utf-8")) == json.loads(out)
        print("OK schema/source-patterns.json == fresh build from the source" if same else "FAIL schema/source-patterns.json is stale vs the source: re-run extraction/build_source_patterns.py")
        return 0 if same else 1
    open(path, "w", encoding="utf-8").write(out)
    print("wrote schema/source-patterns.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
