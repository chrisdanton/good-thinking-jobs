#!/usr/bin/env python3
"""
Builds the GOOD INDEX data files from the GOOD THINKING archive.

  python3 scripts/build-good-index.py

Reads (all local, nothing is rewritten or summarized):
  ../linkedin/search.db                 full text of every letter
  scripts/substack_archive.json         titles + publish dates (from Substack's public archive list)
  ../linkedin/archive/posts.csv         older titles + dates (Substack export)
  ../good-signs/episodes/*-final.md     GOOD SIGNS as shipped (Chris's final wording only)
  public/futures/trends/*.html          GOOD FUTURE 2026 predictions

Writes:
  src/data/good-index/passages.json     original passages, one per paragraph-ish chunk
  src/data/good-index/signs.json        GOOD SIGNS anchors
  src/data/good-index/future-2026.json  GOOD FUTURE 2026 anchors

Run again whenever new letters are added to search.db.
"""
import csv, glob, html, json, os, re, sqlite3, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GT = os.path.dirname(ROOT)
OUT = os.path.join(ROOT, "src", "data", "good-index")
os.makedirs(OUT, exist_ok=True)

def slug_of(url):
    m = re.search(r"/p/([^/?#]+)", url or "")
    return m.group(1) if m else ""

# ── Titles and dates ──
meta = {}
for r in csv.DictReader(open(os.path.join(GT, "linkedin", "archive", "posts.csv"))):
    s = r["post_id"].split(".", 1)[-1]
    meta[s] = {"title": r["title"], "date": r["post_date"][:10], "type": r["type"]}
for p in json.load(open(os.path.join(ROOT, "scripts", "substack_archive.json"))):
    meta[p["slug"]] = {"title": p["title"], "date": p["date"][:10], "type": p["type"]}

# ── Passages ──
BOILER = re.compile(
    r"^(good )?morning|^hi all|^hi,|^hello|subscribe|sponsored by|this (week|month)'?s? (episode|letter)s? (is|are) sponsored|"
    r"that'?s all,? folx|read more|share this|leave a comment|upgrade to paid|^-chris|^xx|^thank you",
    re.I,
)

HEADING = re.compile(r"^[A-Z0-9&’'\-:,.!?/ ]{4,}$")  # ALL-CAPS section and item headings
INLINE_HEAD = re.compile(r"(?:^|\s)(?:[A-Z][A-Z0-9&’'\-,.!? ]{2,}\s)?[A-Z][A-Z0-9&’'\-,.!? ]{2,}\s//\s")

def clean_lines(text):
    # Rejoin lines the HTML export split mid-sentence (around links and bold text),
    # but always break at a heading so passages never run across sections.
    out = []
    for raw in text.split("\n"):
        line = raw.strip()
        if not line:
            continue
        if HEADING.match(line) and sum(c.isalpha() for c in line) >= 3:
            out.append("")  # hard break; empty entries are dropped later
            continue
        # "BRAND NAME // text" item headings: start a new passage at the text.
        m = INLINE_HEAD.search(line)
        if m:
            before, after = line[: m.start()].strip(), line[m.end():].strip()
            if before:
                out.append(before)
            out.append("")
            line = after
            if not line:
                continue
            out.append(line)
            continue
        if out and out[-1] == "":
            out.append(line)
            continue
        if out and (
            not re.search(r"[.!?:\"”’)]$", out[-1])
            or re.match(r"^[a-z,.;:)’'”\-–]", line)
            or len(line) < 25
        ):
            sep = "" if re.match(r"^[,.;:)’'”]", line) or out[-1].endswith(("‘", "“", "(")) else " "
            out[-1] = out[-1] + sep + line
        else:
            out.append(line)
    return out

def chunks(paragraph):
    # Keep passages pull-quote sized: whole sentences, roughly 120 to 480 characters.
    sents = re.split(r"(?<=[.!?”])\s+(?=[A-Z“‘\"])", paragraph)
    cur = ""
    for s in sents:
        if cur and len(cur) + len(s) > 480:
            yield cur
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        yield cur

def text_fragment(passage):
    words = re.sub(r"\s+", " ", passage).split(" ")[:7]
    return "#:~:text=" + urllib.parse.quote(" ".join(words), safe="")

db = sqlite3.connect(os.path.join(GT, "linkedin", "search.db"))
passages, letters, seen = [], 0, set()
PAYWALL = re.compile(r"paid subscriber|bonus content|keep reading with|upgrade to|subscribe to (read|keep)|this post is for", re.I)
for lid, title, date, url, content in db.execute("select id, title, date, url, content from letters"):
    s = slug_of(url)
    m = meta.get(s, {})
    if m.get("type") == "podcast":
        continue
    d = m.get("date") or ""
    if not d and date:
        try:
            from datetime import datetime
            d = datetime.strptime(date, "%B %d, %Y").strftime("%Y-%m-%d")
        except ValueError:
            pass
    if not d:
        continue  # undated pages (e.g. Substack help posts) stay out
    letters += 1
    t = m.get("title") or title
    n = 0
    for para in clean_lines(content or ""):
        if len(para) < 120 or BOILER.search(para[:60]):
            continue
        if para.count("http") > 1:
            continue
        para = re.sub(r"^(//|->|→|•|>)\s*(\S+\s*(//|->|→)\s*)?", "", para).strip()
        for c in chunks(para):
            # Skip fragments that start mid-sentence (they read as broken quotes).
            c = re.sub(r"^[A-Z][A-Z0-9&’'\-,.!? ]{2,}\s//\s", "", c).strip()
            if len(c) < 120 or not re.match(r"^[A-Z0-9“‘\"$£€]", c):
                continue
            if PAYWALL.search(c) or c in seen:
                continue  # Substack teaser/paywall copy, or a passage repeated across letters
            seen.add(c)
            passages.append({
                "id": f"{s}-{n}",
                "text": c,
                "title": t,
                "date": d,
                "url": url + text_fragment(c),
            })
            n += 1

passages.sort(key=lambda p: p["date"])
json.dump(passages, open(os.path.join(OUT, "passages.json"), "w"), ensure_ascii=False)
print(f"passages: {len(passages)} from {letters} letters")

# ── GOOD SIGNS (final, shipped wording only) ──
by_title = {v["title"].strip().lower(): (k, v) for k, v in meta.items() if v.get("title")}
signs = []
for f in sorted(glob.glob(os.path.join(GT, "good-signs", "episodes", "*-final.md"))):
    body = open(f).read()
    body = body.split("YouTube description:")[0]
    sub = re.search(r"Substack title:\s*\n(.+)", body)
    ep_slug, ep = by_title.get(sub.group(1).strip().lower(), (None, None)) if sub else (None, None)
    month = os.path.basename(f)[:7]
    date = ep["date"] if ep else month + "-15"
    ep_url = f"https://ingoodco.substack.com/p/{ep_slug}" if ep_slug else "https://ingoodco.substack.com"
    for m in re.finditer(r"^(?:\[[^\]]+\]\([^)]+\)|\d\d:\d\d)\s+[—–-]\s+(.+?)\s+//\s+(.+)$", body, re.M):
        name = m.group(1).strip()
        text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", m.group(2)).strip()  # keep link text, drop URLs
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        signs.append({"slug": slug, "name": name, "date": date, "text": text, "url": ep_url})
json.dump(signs, open(os.path.join(OUT, "signs.json"), "w"), ensure_ascii=False, indent=1)
print(f"signs: {len(signs)}")

# ── GOOD FUTURE 2026 ──
PRED_URL = "https://ingoodco.substack.com/p/2026-predictions-across-every-category"
PRED_DATE = meta.get("2026-predictions-across-every-category", {}).get("date", "2025-12-21")
future = []
for f in sorted(glob.glob(os.path.join(ROOT, "public", "futures", "trends", "*.html"))):
    t = open(f).read()
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    lines = [l.strip() for l in html.unescape(re.sub(r"<[^>]+>", "\n", t)).split("\n") if l.strip()]
    try:
        i = lines.index("BY")  # end of the nav; the article opens: Category, Title, lead, BY
        j = lines.index("BY", i + 1)
    except ValueError:
        continue
    category, name = lines[i + 1], lines[i + 2]
    lead = ""
    for piece in lines[i + 3 : j]:
        lead += ("" if re.match(r"^[,.;:)’'”]", piece) or not lead else " ") + piece
    if len(lead) < 60 or category in ("Who Made This",):
        continue
    slug = os.path.basename(f)[:-5]
    future.append({
        "slug": slug, "category": category, "name": name, "date": PRED_DATE,
        "text": lead, "url": f"/futures/trends/{slug}",
    })
json.dump(future, open(os.path.join(OUT, "future-2026.json"), "w"), ensure_ascii=False, indent=1)
print(f"future 2026: {len(future)}")
