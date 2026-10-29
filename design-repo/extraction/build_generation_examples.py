#!/usr/bin/env python3
"""build_generation_examples.py - writes one mode:'generation' example PageSpec per template family.

The examples are for a FICTIONAL brand ("Larkspur", larkspur.example): original copy from the phrase banks below, only
generation-safe asset roles (placeholder / generated / user-supplied), placeholder URLs (.example), fictional people,
fictional customers and invented numbers. Each is built from the template's own node list and the section contracts
(counts, required fields, conditional rules), then validated by schema/semantic_validate.py; the build fails if any
example is not clean (0 errors, 0 warnings).

template.product is deliberately skipped: its sections are spec-only (retrievalEligible false - the product routes render
a placeholder page in the clone), and a generation-mode PageSpec may not use retrieval-ineligible sections.

  python3 extraction/build_generation_examples.py           # (re)write schema/examples/generated.*.pagespec.json
  python3 extraction/build_generation_examples.py --check   # exit 1 if a file on disk differs from a fresh build
"""
import copy
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "schema"))
import semantic_validate as sv  # noqa: E402

BRAND = {"name": "Larkspur", "domain": "larkspur.example"}
FAMILIES = {  # family -> (template, route)
    "home": ("template.home", "/"), "plans": ("template.plans", "/plans"), "security": ("template.security", "/security"),
    "contact": ("template.contact", "/contact"), "company": ("template.company", "/company"), "careers": ("template.careers", "/careers"),
    "legal": ("template.legal", "/terms-of-service"), "blog-index": ("template.blog-index", "/blog"),
    "blog-post": ("template.blog-post", "/blog/closing-the-books-in-four-days"), "case-studies-index": ("template.case-studies-index", "/case-studies"),
    "case-study": ("template.case-study", "/case-studies/fernhill-foods-month-end"), "not-found": ("template.not-found", "/404"),
}
BANK = {
    "title": ["Ledgers that reconcile while you sleep", "Close the month without chasing spreadsheets", "Every invoice matched and every exception explained",
              "Clear books for growing finance teams", "Plans that grow with your ledger", "Built to keep your numbers private"],
    "eyebrow": ["Larkspur platform", "How it works", "Pricing", "Trust", "About Larkspur", "Open roles", "Journal", "Stories"],
    "lead": ["Larkspur pairs bank feeds with your general ledger and flags only the entries that need a human decision.",
             "Connect accounts once, then review a short queue of exceptions instead of thousands of rows."],
    "body": ["Bank lines, invoices and receipts land in one queue, already matched where the evidence agrees.",
             "Approvers see the source document beside every entry, so sign-off takes minutes rather than days."],
    "label": ["Reconciliation", "Approvals", "Audit trail", "Forecasts", "Exports", "Alerts"],
    "name": ["Mara Ellison", "Tobias Renn", "Priya Okafor", "Jonas Whitfield"],
    "personName": ["Mara Ellison", "Tobias Renn", "Priya Okafor", "Jonas Whitfield"],
    "author": ["Mara Ellison", "Tobias Renn"],
    "role": ["Controller", "Finance lead", "Treasury analyst", "Payroll manager"],
    "personRole": ["Controller at Fernhill Foods", "Finance lead at Quillby"],
    "authorRole": ["Controller at Fernhill Foods", "Finance lead at Quillby"],
    "value": ["38%", "4.2x", "12 days", "9 of 10"],
    "heading": ["Why finance teams switch", "What changes in week one", "Questions we hear often"],
    "question": ["Can we import last year's ledger?", "Who can approve a payment run?", "Where is our data stored?"],
    "answer": ["Yes. Upload a CSV export and Larkspur maps the accounts, then shows anything it could not place.",
               "Any member with the approver permission; every approval is logged with the reviewer and timestamp."],
    "quote": ["Our close went from nine working days to four, and the auditors asked fewer questions.",
              "We finally trust the dashboard numbers before the board meeting."],
    "quotes": ["Fewer late nights at month end", "The audit trail does the explaining"],
    "description": ["Fernhill Foods is a fictional regional grocer used in Larkspur sample material.", "Quillby is a fictional design studio."],
    "subtitle": ["How a fictional grocer shortened its month-end close", "A sample story with invented numbers"],
    "breadcrumb": ["Stories"], "head": ["Product"], "submitLabel": ["Send"], "quarter": ["Q3"],
    "copyright": ["Larkspur Example Ltd, all rights reserved"], "hostedNote": ["Hosted in a sample region for demos"],
    "blurb": ["Calm books for busy finance teams. Product notes once a month."],
    "consentText": ["We use your details only to reply to this message."],
    "price": ["Free", "Custom"], "date": ["Mar 4, 2027"], "lastUpdated": ["Mar 4, 2027"], "location": ["Remote, Europe"],
    "status": ["Open", "Hiring now"], "text": ["Larkspur sample paragraph written for this example page; it describes no real company."],
    "items": ["A sample list item written for the Larkspur example."],
    "alt": ["Fernhill Foods logo", "Quillby logo", "Oakmere logo", "Tallow and Pine logo"],
}
LINKS = ["Talk to sales", "See how it works", "Start a trial", "Read the guide"]
FALLBACK = "Larkspur keeps every ledger entry traceable to its source document"


def words_cap(s, n):
    w = s.split()
    return " ".join(w[:max(1, n)])


class Gen:
    def __init__(self, ctx):
        self.ctx = ctx
        self.i = 0

    def text(self, name, f):
        bank = BANK.get(name) or [FALLBACK]
        self.i += 1
        return words_cap(bank[self.i % len(bank)], f["maxWords"])

    def asset(self, f, name):
        roles = [self.ctx["roles"][r] for r in f["roles"]]
        safe = [r for r in roles if r["availability"] == "generation-safe"]
        pref = ["brand.placeholder-mark", "placeholder.company-logo", "fictional.person-avatar", "generated.illustration", "placeholder.screenshot"]
        r = next((x for p in pref for x in safe if x["role"] == p), None) or next(x for x in safe if x["role"] != "asset.user-supplied")
        src = r["generationAssetSources"][0]
        prefix = {"generate-new": "generated", "placeholder": "placeholder", "user-supplied": "user-supplied"}[src]
        self.i += 1
        return {"assetRole": r["role"], "assetSource": src, "alt": words_cap("Larkspur sample image " + str(self.i), 12) if src != "placeholder" else "Placeholder image",
                "assetRef": f"{prefix}:larkspur-{name.lower()}-{self.i}"}

    def value(self, name, f):
        t = f["type"]
        if t == "text":
            return self.text(name, f)
        if t == "target":
            return "/contact"
        if t == "link":
            self.i += 1
            return {"label": words_cap(LINKS[self.i % len(LINKS)], f["labelMaxWords"]), "to": ["dest:booking", "/contact", "#how-it-works", "dest:app-trial"][self.i % 4]}
        if t == "asset":
            return self.asset(f, name)
        if t == "list":
            return [self.value(name, f["item"]) for _ in range(f["minItems"])]
        if t == "object":
            return {k: self.value(k, v) for k, v in f["fields"].items() if v.get("required", True)}
        if t == "enum":
            return "none" if "none" in f["values"] else next(x for x in f["values"] if x not in f.get("primefoldBadgeValues", []))
        if t == "bool":
            return True
        if t == "form":
            return {"endpointRole": f["endpointRole"], "endpoint": "project-owned-placeholder"}
        raise AssertionError(t)

    def content(self, sec, variant):
        fields = sec["content"]["fields"]
        c = {k: self.value(k, v) for k, v in fields.items() if v.get("required", True)}
        for rule in sec.get("rules", []):
            w = rule["when"]
            if ("variant" in w and variant != w["variant"]) or ("variantNot" in w and variant == w["variantNot"]) or ("field" in w and c.get(w["field"]) != w["equals"]):
                continue
            for k in rule.get("require", []):
                c.setdefault(k, self.value(k, fields[k]))
            for k in rule.get("forbid", []):
                c.pop(k, None)
            if "countField" in rule:
                lst = c[rule["countField"]]
                while len(lst) < rule["countEquals"]:
                    lst.append(copy.deepcopy(lst[-1]))
                del lst[rule["countEquals"]:]
        return c


def build_one(ctx, family, template, route):
    g = Gen(ctx)
    r = sv._route_for(ctx, {"route": route, "mode": "generation"})
    tpl = ctx["templates"][template]
    nodes = []
    for tn in tpl["nodes"]:
        sec = ctx["sections"][tn["section"]]
        variant = r["variantOverrides"].get(sec["id"]) or (tn.get("variants") or sec["variants"])[0]
        reps = 2 if tn.get("repeatable") else 1
        for _ in range(reps):
            m = sec["motion"]["allowed"][0]
            nd = {"section": sec["id"], "variant": variant, "content": g.content(sec, variant),
                  "motion": {"pattern": m["pattern"], "trigger": m["trigger"], "reducedMotionFallback": m["reducedMotionFallback"]}}
            nodes.append(nd)
    spec = {"pageSpecVersion": sv_version(), "mode": "generation", "theme": "light", "brand": dict(BRAND), "template": template, "route": route,
            "meta": {"title": f"Larkspur - {family.replace('-', ' ')} (generation example)",
                     "description": "Fictional brand example built from this design-repo's contracts; original copy, placeholder assets and .example URLs only.",
                     "ogImage": {"assetRole": "brand.placeholder-mark", "assetSource": "placeholder", "alt": "Larkspur placeholder mark", "assetRef": "placeholder:larkspur-og"}},
            "nodes": nodes}
    # show the style-token and placeholder-URL paths once per example (validated like everything else)
    for n in nodes:
        if n["section"] == "conversion.cta-band":
            n["styleTokens"] = {"surface": "surface.inverse", "text": "text.inverse", "spacingTop": "spacing.24", "headingFont": "fontFamily.headline", "radius": "radius.lg"}
            n["content"]["button"] = {"label": "Read the guide", "to": "https://help.larkspur.example/start"}
    return spec


def sv_version():
    return json.load(open(os.path.join(ROOT, "schema", "pagespec.schema.json"), encoding="utf-8"))["properties"]["pageSpecVersion"]["const"]


def build_all():
    ctx = sv.load_context(ROOT)
    out, problems = {}, []
    for fam, (tpl, route) in FAMILIES.items():
        spec = build_one(ctx, fam, tpl, route)
        errs, warns = sv.validate_all(spec, ctx)
        if errs or warns:
            problems.append((fam, errs[:4], warns[:2]))
        out[f"schema/examples/generated.{fam}.pagespec.json"] = json.dumps(spec, indent=2, ensure_ascii=False) + "\n"
    return out, problems


def main():
    out, problems = build_all()
    if problems:
        for p in problems:
            print("FAIL", p)
        return 1
    if "--check" in sys.argv:
        stale = [p for p, s in out.items() if not os.path.exists(os.path.join(ROOT, p)) or json.load(open(os.path.join(ROOT, p))) != json.loads(s)]
        print("OK generation examples == fresh build" if not stale else f"FAIL stale generation examples: {stale}")
        return 1 if stale else 0
    os.makedirs(os.path.join(ROOT, "schema", "examples"), exist_ok=True)
    for p, s in out.items():
        open(os.path.join(ROOT, p), "w", encoding="utf-8").write(s)
    print(f"wrote {len(out)} generation examples (all 0 errors, 0 warnings)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
