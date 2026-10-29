#!/usr/bin/env python3
"""build_schema.py - regenerates schema/pagespec.schema.json from the contracts it describes.

Inputs : sections/*.json (fields, variants, motion triples), templates/templates.json (template enum),
         assets/asset-roles.json (asset roles, destination roles), tokens/llm/token-policy.json (style-token slots).
Output : schema/pagespec.schema.json (Draft-07, closed everywhere).

  python3 extraction/build_schema.py          # rewrite the schema
  python3 extraction/build_schema.py --check  # exit 1 if the schema on disk differs from a fresh build

verify_all.py runs the --check path, so a contract edit that is not propagated into the schema fails the run.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGESPEC_VERSION = "1.1.0"
ASSET_SOURCES = ["reuse-exact", "generate-new", "placeholder", "user-supplied"]
# assetRef: optional pointer to the concrete file. Clone mode may name a real source file (public/...);
# generation mode may only use generated:/placeholder:/user-supplied: refs (enforced in semantic_validate.py).
ASSET_REF_PATTERN = r"^(public/[A-Za-z0-9/._-]+|generated:[a-z0-9][a-z0-9._-]*|placeholder:[a-z0-9][a-z0-9._-]*|user-supplied:[a-z0-9][a-z0-9._-]*)$"


def load(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return json.load(f)


def target_pattern(dests):
    # internal route | in-page anchor | dest:<registered role> | reserved placeholder URL (.example/.invalid only)
    return ("^(/[A-Za-z0-9/._~#-]*|#[a-z0-9-]+|dest:(" + "|".join(dests) + ")"
            "|https://([a-z0-9-]+\\.)*[a-z0-9-]+\\.(example|invalid)(/[A-Za-z0-9/._~#-]*)?)$")


def field_schema(f, ctx):
    t = f["type"]
    if t == "text":
        out = {"type": "string", "minLength": 1, "x-maxWords": f["maxWords"]}
        if f.get("placeholderOnly"):
            out["x-placeholderOnly"] = True
        return out
    if t == "target":
        return {"type": "string", "pattern": ctx["target"]}
    if t == "link":
        return {"type": "object", "additionalProperties": False, "required": ["label", "to"],
                "properties": {"label": {"type": "string", "minLength": 1, "x-maxWords": f["labelMaxWords"]},
                               "to": {"type": "string", "pattern": ctx["target"]}}}
    if t == "asset":
        return {"type": "object", "required": ["assetRole", "assetSource", "alt"], "additionalProperties": False,
                "properties": {"assetRole": {"enum": f["roles"]}, "assetSource": {"enum": ASSET_SOURCES},
                               "alt": {"type": "string", "x-maxWords": 12},
                               "assetRef": {"type": "string", "pattern": ASSET_REF_PATTERN}}}
    if t == "list":
        return {"type": "array", "minItems": f["minItems"], "maxItems": f["maxItems"], "items": field_schema(f["item"], ctx)}
    if t == "object":
        return obj_schema(f["fields"], ctx)
    if t == "enum":
        return {"enum": f["values"]}
    if t == "bool":
        return {"type": "boolean"}
    if t == "form":
        return {"type": "object", "required": ["endpointRole", "endpoint"], "additionalProperties": False,
                "properties": {"endpointRole": {"const": f["endpointRole"]}, "endpoint": {"const": "project-owned-placeholder"}}}
    raise ValueError("unknown field type " + t)


def obj_schema(fields, ctx):
    return {"type": "object", "additionalProperties": False,
            "required": [k for k, v in fields.items() if v.get("required", True)],
            "properties": {k: field_schema(v, ctx) for k, v in fields.items()}}


def motion_schema(sec):
    return {"anyOf": [{"type": "object", "required": ["pattern", "trigger", "reducedMotionFallback"], "additionalProperties": False,
                       "properties": {"pattern": {"const": m["pattern"]}, "trigger": {"const": m["trigger"]},
                                      "reducedMotionFallback": {"const": m["reducedMotionFallback"]}}} for m in sec["motion"]["allowed"]]}


def build():
    secs = []
    for fn in sorted(os.listdir(os.path.join(ROOT, "sections"))):
        if fn.endswith(".json"):
            secs.append(load(os.path.join("sections", fn)))
    order = load("tokens/llm/component-allowlist.json")["sections"]
    secs.sort(key=lambda s: order.index(s["id"]) if s["id"] in order else len(order))
    tpls = [t["id"] for t in load("templates/templates.json")["templates"]]
    A = load("assets/asset-roles.json")
    roles = [r["role"] for r in A["roles"] if r["class"] == "asset"]
    dests = [r["role"].split(":", 1)[1] for r in A["roles"] if r["class"] == "destination"]
    pol = load("tokens/llm/token-policy.json")
    ctx = {"target": target_pattern(dests)}
    patterns, triggers, fallbacks = set(), set(), set()
    for s in secs:
        for m in s["motion"]["allowed"]:
            patterns.add(m["pattern"]); triggers.add(m["trigger"]); fallbacks.add(m["reducedMotionFallback"])
    slots = pol["styleSlots"]
    style = {"type": "object", "additionalProperties": False, "minProperties": 1,
             "description": "Optional per-node style-token slots. Values are token PATHS from tokens/llm/token-catalog.json; which category each slot "
                            "accepts, raw-value bans and theme combinations are enforced by schema/semantic_validate.py (TOKEN_* rules).",
             "properties": {k: {"type": "string", "minLength": 1} for k in slots}}
    node = {"type": "object", "additionalProperties": False, "required": ["section", "variant", "content", "motion"],
            "properties": {"section": {"enum": [s["id"] for s in secs]}, "variant": {"type": "string"},
                           "content": {"type": "object"}, "motion": {"$ref": "#/definitions/motion"},
                           "styleTokens": {"$ref": "#/definitions/styleTokens"}},
            "allOf": [{"if": {"required": ["section"], "properties": {"section": {"const": s["id"]}}},
                       "then": {"properties": {"variant": {"enum": s["variants"]}, "content": obj_schema(s["content"]["fields"], ctx),
                                               "motion": motion_schema(s)}}} for s in secs]}
    themes = sorted(pol["themes"])
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "primefold-pagespec",
        "title": "Primefold PageSpec",
        "description": "A page composition: one template, one route, a mode and an ordered node list. Draft-07; closed enums; additionalProperties:false "
                       "everywhere. mode 'clone' = faithful Primefold reconstruction (Primefold-owned assets may be reused); mode 'generation' = a page "
                       "for another brand (no Primefold identity, assets, copy, people, customers or URLs; enforced by schema/semantic_validate.py "
                       "GENERATION_MODE_* rules). x-maxWords / x-placeholderOnly are enforced by the semantic validator. "
                       "GENERATED by extraction/build_schema.py from the contracts - do not hand-edit.",
        "type": "object",
        "additionalProperties": False,
        "required": ["pageSpecVersion", "mode", "template", "route", "meta", "nodes"],
        "properties": {
            "pageSpecVersion": {"const": PAGESPEC_VERSION},
            "mode": {"enum": ["clone", "generation"],
                     "description": "clone: faithful reconstruction of the Primefold source. generation: a new page for another brand."},
            "theme": {"enum": themes, "description": "Theme the styleTokens resolve against (tokens/themes). Defaults to the manifest defaultTheme."},
            "brand": {"type": "object", "additionalProperties": False, "required": ["name"],
                      "description": "Generation mode: the brand the page is FOR (fictional or user-supplied). Must not be a Primefold name.",
                      "properties": {"name": {"type": "string", "minLength": 1, "maxLength": 60},
                                     "domain": {"type": "string", "pattern": "^([a-z0-9-]+\\.)*[a-z0-9-]+\\.(example|invalid)$"}}},
            "template": {"enum": tpls},
            "route": {"type": "string", "pattern": "^/[A-Za-z0-9/._~-]*$"},
            "meta": {"type": "object", "additionalProperties": False, "required": ["title", "description"],
                     "properties": {"title": {"type": "string", "minLength": 1, "maxLength": 120},
                                    "description": {"type": "string", "minLength": 1, "maxLength": 300},
                                    "ogImage": {"type": "object", "required": ["assetRole", "assetSource", "alt"], "additionalProperties": False,
                                                "properties": {"assetRole": {"enum": [r["role"] for r in A["roles"] if r.get("ogImageEligible")]},
                                                               "assetSource": {"enum": ASSET_SOURCES}, "alt": {"type": "string", "x-maxWords": 12},
                                                               "assetRef": {"type": "string", "pattern": ASSET_REF_PATTERN}}}}},
            "nodes": {"type": "array", "minItems": 3, "items": {"$ref": "#/definitions/node"}},
        },
        "definitions": {
            "motion": {"type": "object", "additionalProperties": False, "required": ["pattern", "trigger", "reducedMotionFallback"],
                       "properties": {"pattern": {"enum": sorted(patterns)}, "trigger": {"enum": sorted(triggers, key=["load", "scroll", "hover", "click", "in-view", "timer", "continuous"].index)},
                                      "reducedMotionFallback": {"enum": sorted(fallbacks)}}},
            "assetRole": {"enum": roles},
            "styleTokens": style,
            "node": node,
        },
    }


def main():
    out = json.dumps(build(), indent=2, ensure_ascii=False) + "\n"
    path = os.path.join(ROOT, "schema", "pagespec.schema.json")
    if "--check" in sys.argv:
        cur = open(path, encoding="utf-8").read()
        if json.loads(cur) != json.loads(out):
            print("FAIL schema/pagespec.schema.json is stale: re-run extraction/build_schema.py")
            return 1
        print("OK schema/pagespec.schema.json == fresh build from contracts")
        return 0
    open(path, "w", encoding="utf-8").write(out)
    print("wrote schema/pagespec.schema.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
