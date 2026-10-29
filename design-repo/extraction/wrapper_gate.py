#!/usr/bin/env python3
"""wrapper_gate.py - whole-page-wrapper quality gate over MEASURED section heights (R6/R9).

Reads extraction/measured-values.json -> sectionHeights (measured at 1440px by extraction/measure_sections.mjs from the
built clone) and fails when a section behaves like a page wrapper instead of a semantic unit:

  * HERO taller than HERO_WARN_PX warns; taller than HERO_ERROR_PX fails unless whitelisted
  * one in-flow section holding more than SHARE_WARN of its page warns; more than SHARE_ERROR fails unless whitelisted
    (pages with fewer than MIN_INFLOW in-flow non-shell sections are skipped; SHELL and fixed elements are excluded)
  * a route without a measurement fails; a measurement at the wrong viewport fails; a measured node sequence that does
    not match the route's template fails
  * whitelist entries need reviewedBy, a justification of 30+ characters and a maxHeightPx above the measured height;
    stale or over-cap entries fail; an agent reviewer must say "agent attestation, not a human sign-off"; a whitelisted
    hit still warns

Thresholds are pinned HERE in code (not only in JSON). Routes of PINNED_UNRENDERED_TEMPLATES may carry a notRendered
record instead of a measurement, but only while every content section of that template is unmounted (spec-only).

Usage: python3 extraction/wrapper_gate.py   (exit 1 on any error; verify_all.py imports evaluate())
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEWPORT = 1440
HERO_WARN_PX = 1800
HERO_ERROR_PX = 3000
SHARE_WARN = 0.50
SHARE_ERROR = 0.60
MIN_INFLOW = 3
PINNED_UNRENDERED_TEMPLATES = {"template.product"}
AGENT_ATTESTATION = "agent attestation, not a human sign-off"


def _load(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return json.load(f)


def load_inputs():
    secs = {}
    for fn in sorted(os.listdir(os.path.join(ROOT, "sections"))):
        if fn.endswith(".json"):
            s = _load(os.path.join("sections", fn))
            secs[s["id"]] = s
    return (_load("extraction/measured-values.json").get("sectionHeights"), {t["id"]: t for t in _load("templates/templates.json")["templates"]},
            _load("templates/routes.json")["routes"], secs)


def _matches_template(seq, tnodes):
    j = 0
    prev = None
    for s in seq:
        if prev is not None and s == prev and any(n["section"] == s and n.get("repeatable") for n in tnodes):
            continue
        k = next((k for k in range(j, len(tnodes)) if tnodes[k]["section"] == s), None)
        if k is None or any(n["required"] for n in tnodes[j:k]):
            return False
        j, prev = k + 1, s
    return not any(n["required"] for n in tnodes[j:])


def evaluate(sh, templates, routes, secs):
    errors, warns, oks = [], [], []
    if not sh:
        return ["no sectionHeights recorded in extraction/measured-values.json"], warns, oks
    if sh.get("viewport") != VIEWPORT:
        errors.append(f"sectionHeights measured at viewport {sh.get('viewport')}, gate requires {VIEWPORT}")
    wl = sh.get("whitelist", [])
    used = set()
    for i, w in enumerate(wl):
        if len(w.get("justification", "")) < 30 or not w.get("reviewedBy"):
            errors.append(f"whitelist[{i}] {w.get('route')} {w.get('section')}: needs reviewedBy and a justification of 30+ characters")
        if "agent" in w.get("reviewedBy", "").lower() and AGENT_ATTESTATION not in w.get("reviewedBy", ""):
            errors.append(f"whitelist[{i}]: an agent reviewer must state '{AGENT_ATTESTATION}'")
    measured = sh.get("routes", {})
    unrendered = sh.get("notRendered", {})
    for r in routes:
        path, tid = r["path"], r["template"]
        if path not in measured:
            nr = unrendered.get(path)
            content = [n["section"] for n in templates[tid]["nodes"] if secs[n["section"]]["category"] != "SHELL" and n["section"] != "conversion.cta-band"]
            if nr and tid in PINNED_UNRENDERED_TEMPLATES and len(nr.get("reason", "")) >= 30 and all(secs[s]["status"] != "mounted" for s in content):
                oks.append(f"{path}: not rendered by the clone ({tid}, all content sections spec-only) - recorded, not measurable")
            else:
                errors.append(f"{path}: missing measurement (no sectionHeights entry)")
            continue
        m = measured[path]
        seq = [n["section"] for n in m["nodes"]]
        if m.get("template") != tid or not _matches_template(seq, templates[tid]["nodes"]):
            errors.append(f"{path}: measured node sequence does not match {tid}")
            continue
        page = m["pageHeight"]
        inflow = [n for n in m["nodes"] if n.get("inFlow", True) and secs[n["section"]]["category"] != "SHELL"]
        for n in m["nodes"]:
            sec = secs[n["section"]]
            h = n["heightPx"]
            hit = None
            if sec["category"] == "HERO":
                if h > HERO_ERROR_PX:
                    hit = ("error", f"{path}: HERO {n['section']} is {h}px (> {HERO_ERROR_PX}px)")
                elif h > HERO_WARN_PX:
                    warns.append(f"{path}: HERO {n['section']} is {h}px (> {HERO_WARN_PX}px)")
            if hit is None and len(inflow) >= MIN_INFLOW and n in inflow:
                share = h / page if page else 0
                if share > SHARE_ERROR:
                    hit = ("error", f"{path}: {n['section']} holds {share:.0%} of the page (> {SHARE_ERROR:.0%})")
                elif share > SHARE_WARN:
                    warns.append(f"{path}: {n['section']} holds {share:.0%} of the page (> {SHARE_WARN:.0%})")
            if hit:
                wi = next((k for k, w in enumerate(wl) if w.get("route") == path and w.get("section") == n["section"]), None)
                if wi is None:
                    errors.append(hit[1] + " and is not whitelisted")
                elif wl[wi].get("maxHeightPx", 0) < h:
                    errors.append(hit[1] + f"; whitelist cap {wl[wi].get('maxHeightPx')}px is below the measured height")
                else:
                    used.add(wi)
                    warns.append(hit[1] + " (whitelisted)")
    for i, w in enumerate(wl):
        if i not in used:
            errors.append(f"whitelist[{i}] {w.get('route')} {w.get('section')}: stale (no current gate hit)")
    oks.append(f"{len(measured)} routes measured at {sh.get('viewport')}px; HERO warn/error {HERO_WARN_PX}/{HERO_ERROR_PX}px; share warn/error {SHARE_WARN:.0%}/{SHARE_ERROR:.0%}")
    return errors, warns, oks


def main():
    errors, warns, oks = evaluate(*load_inputs())
    for o in oks:
        print("OK   ", o)
    for w in warns:
        print("WARN ", w)
    for e in errors:
        print("FAIL ", e)
    print(f"\nwrapper gate: {len(errors)} error(s), {len(warns)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
