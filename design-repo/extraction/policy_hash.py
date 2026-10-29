#!/usr/bin/env python3
"""policy_hash.py - content hash of the files the design policy is enforced by.

  python3 extraction/policy_hash.py          # print the hash
  python3 extraction/policy_hash.py --write  # store it in registry.manifest.json designPolicy.contentHash

Hash = sha256 over policy/design-policy.json enforcedBy files, in sorted path order, each fed as
<relative path> NUL <file bytes> NUL. extraction/verify_all.py recomputes it and fails on mismatch.
"""
import hashlib
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def compute(root=ROOT):
    pol = json.load(open(os.path.join(root, "policy", "design-policy.json"), encoding="utf-8"))
    h = hashlib.sha256()
    for rel in sorted(pol["enforcedBy"]):
        h.update(rel.encode() + b"\0")
        with open(os.path.join(root, rel), "rb") as f:
            h.update(f.read())
        h.update(b"\0")
    return "sha256:" + h.hexdigest()


def main():
    v = compute()
    if "--write" in sys.argv:
        p = os.path.join(ROOT, "registry.manifest.json")
        m = json.load(open(p, encoding="utf-8"))
        m["designPolicy"]["contentHash"] = v
        open(p, "w", encoding="utf-8").write(json.dumps(m, indent=2, ensure_ascii=False) + "\n")
        print("wrote", v)
    else:
        print(v)
    return 0


if __name__ == "__main__":
    sys.exit(main())
