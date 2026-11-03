#!/usr/bin/env python3
"""Refresh scripts/substack_archive.json (titles + publish dates) from Substack's public archive list."""
import json, os, time, urllib.request

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "substack_archive.json")
known = {p["slug"]: p for p in json.load(open(OUT))} if os.path.exists(OUT) else {}
for off in range(0, 2000, 50):
    req = urllib.request.Request(
        f"https://ingoodco.substack.com/api/v1/archive?sort=new&offset={off}&limit=50",
        headers={"User-Agent": "Mozilla/5.0 (GOOD INDEX refresh)"},
    )
    batch = json.load(urllib.request.urlopen(req, timeout=30))
    if not batch:
        break
    for p in batch:
        known[p["slug"]] = {"slug": p["slug"], "title": p["title"], "subtitle": p.get("subtitle"), "date": p["post_date"],
                            "type": p["type"], "audience": p.get("audience"), "url": p["canonical_url"]}
    time.sleep(0.5)
json.dump(sorted(known.values(), key=lambda p: p["date"], reverse=True), open(OUT, "w"))
print(f"archive list: {len(known)} posts")
