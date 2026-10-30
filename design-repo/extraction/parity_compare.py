#!/usr/bin/env python3
"""parity_compare.py - per-section live-vs-clone pixel parity from two parity_capture.mjs runs (R12).

Usage: python3 extraction/parity_compare.py LIVE_DIR CLONE_DIR OUT_DIR
Reports per section: pixel (share of unmasked pixels whose max RGB channel diff <= 32), ink (same, counted only where either
side differs from the section background - stricter, text/illustration only) and masked (share of the section area excluded as
truly dynamic: eyebrow spinner glyphs, the hero chat thread + prompt bar, the CTA wave shader, the XI Sources Lottie and the
solutions marquee rows). Writes side-by-side pairs and scores.json into OUT_DIR. Needs Pillow.
"""
import json, sys, os
from PIL import Image, ImageChops, ImageDraw
TOL = 32
L, C, O = sys.argv[1], sys.argv[2], sys.argv[3]
extra = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
os.makedirs(O, exist_ok=True)
li, ci = json.load(open(L + '/index.json')), json.load(open(C + '/index.json'))
out = {}
for k, shots in li['res'].items():
    cs = ci['res'].get(k)
    if not shots or not cs: out[k] = None; continue
    tot = ok = ink = inkok = area = 0
    for i, s in enumerate(shots):
        if i >= len(cs): break
        c = cs[i]
        a = Image.open(s['file']).convert('RGB'); bimg = Image.open(c['file']).convert('RGB')
        x, y, w, h = s['rect']
        box = (max(0, int(x)), max(0, int(y)), min(a.width, int(x + w)), min(a.height, int(y + h)))
        if box[2] <= box[0] or box[3] <= box[1]: continue
        m = Image.new('L', a.size, 255); d = ImageDraw.Draw(m)
        for mx, my, mw, mh in s['masks'] + c['masks'] + [tuple(r) for r in extra.get(k, {}).get(str(i), [])]:
            d.rectangle([mx - 2, my - 2, mx + mw + 2, my + mh + 2], fill=0)
        diff = ImageChops.difference(a, bimg).crop(box)
        mm = m.crop(box)
        px = diff.load(); mp = mm.load()
        ca, cb = a.crop(box), bimg.crop(box)
        pa, pb = ca.load(), cb.load()
        # background = most common colour of the live crop; "ink" pixels differ from it on either side
        bg = max(ca.getcolors(1 << 24), key=lambda t: t[0])[1]
        W_, H_ = diff.size
        for yy in range(0, H_, 2):
            for xx in range(0, W_, 2):
                area += 1
                if not mp[xx, yy]: continue
                tot += 1
                good = max(px[xx, yy]) <= TOL
                if good: ok += 1
                if max(abs(u - v) for u, v in zip(pa[xx, yy], bg)) > TOL or max(abs(u - v) for u, v in zip(pb[xx, yy], bg)) > TOL:
                    ink += 1
                    if good: inkok += 1
        # side-by-side for eyeballing
        sb = Image.new('RGB', (a.width, a.height * 2)); sb.paste(a, (0, 0)); sb.paste(bimg, (0, a.height))
        sb.resize((a.width // 2, a.height)).save(f'{O}/{k}-{i}-pair.png')
    out[k] = {'pixel': round(100 * ok / tot, 1), 'ink': round(100 * inkok / ink, 1) if ink else None, 'masked': round(100 * (area - tot) / area, 1)} if tot else None
print(json.dumps(out))
json.dump(out, open(O + '/scores.json', 'w'), indent=1)
