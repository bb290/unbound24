# Sync the website's lesson content into the Notion Lessons database (Unbound24 workspace).
# Each live lesson page gets one toggle heading, "Live on the website", which is replaced on every run.
# Nothing else on the page is touched.
# Usage: python3 scripts/sync-notion-lessons.py src/content/course-lessons.json YYYY-MM-DD
import json, re, sys
import subprocess

# Notion through Composio, Unbound24 account only (see CLAUDE.md).
def nt(path,body=None,method="GET"):
    a=["composio","proxy","https://api.notion.com/v1/"+path,"-X",method,"-t","notion","--account","Unbound24","-H","Notion-Version: 2022-06-28","-H","content-type: application/json"]
    if body is not None: a+=["-d",json.dumps(body)]
    r=subprocess.run(a,stdin=subprocess.DEVNULL,capture_output=True,text=True);d=json.loads(r.stdout);d=d.get("data",d)
    if d.get("object")=="error": raise SystemExit(json.dumps(d)[:800])
    return d
def kids(bid):
    out=[];cur=None
    while True:
        d=nt(f"blocks/{bid}/children?page_size=100"+(f"&start_cursor={cur}" if cur else ""))
        out+=d["results"]
        if not d.get("has_more"): return out
        cur=d["next_cursor"]
def txt(b):
    t=b["type"];v=b.get(t,{})
    return "".join(x.get("plain_text","") for x in v.get("rich_text",[])) if isinstance(v,dict) else ""
assert nt("users/me")["bot"]["workspace_name"]=="Unbound24"

DB = "4049f6e8-8800-81c2-b9c2-dc03ccdbe25e"
TOGGLE = "Live on the website"
SITE = "https://www.unbound24.com/course/"
TODAY = sys.argv[2] if len(sys.argv) > 2 else ""

lessons = json.load(open(sys.argv[1]))

def rt(text):
    m = re.match(r"^\*\*(.+?)\*\*\s*([\s\S]*)$", text)
    if m:
        return [{"type": "text", "text": {"content": m.group(1) + " "}, "annotations": {"bold": True}},
                {"type": "text", "text": {"content": m.group(2)}}]
    return [{"type": "text", "text": {"content": text}}]

def block(kind, text):
    return {"object": "block", "type": kind, kind: {"rich_text": rt(text)}}

def code(text):
    chunks = [text[i:i + 1900] for i in range(0, len(text), 1900)]
    return {"object": "block", "type": "code",
            "code": {"language": "plain text", "rich_text": [{"type": "text", "text": {"content": c}} for c in chunks]}}

def link_para(lesson):
    url = SITE + lesson["slug"]
    return {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [
        {"type": "text", "text": {"content": f"Synced from the website{(' on ' + TODAY) if TODAY else ''}. Live page: "}, "annotations": {"italic": True}},
        {"type": "text", "text": {"content": url, "link": {"url": url}}},
        {"type": "text", "text": {"content": ". Edit the website and re-sync; changes made only here won't reach the site."}, "annotations": {"italic": True}},
    ]}}

def action_blocks(a):
    out = [block("heading_3", "Your Action: " + a["title"]), block("paragraph", a["text"])]
    if a.get("skill"):
        out.append(block("paragraph", f"Download button: {a['skill']['label']} ({a['skill']['href']})"))
    if a.get("prompt"):
        out += [block("paragraph", "**" + (a.get("promptLabel") or "Your Claude prompt") + "**"), code(a["prompt"])]
    for p in a.get("prompts", []):
        out += [block("paragraph", "**" + p["title"] + "**"), code(p["prompt"])]
    return out

def content(lesson):
    out = [link_para(lesson), block("paragraph", "**Summary:** " + lesson.get("summary", "")),
           block("heading_3", "Key Takeaways")]
    out += [block("numbered_list_item", t) for t in lesson.get("takeaways", [])]
    a = lesson.get("action")
    if a: out += action_blocks(a)
    glossary = lesson.get("shape") == "glossary"
    for i, s in enumerate(lesson["sections"], 1):
        out.append(block("heading_3", s["title"] if glossary else f"{i}. {s['title']}"))
        out += [block("bulleted_list_item", b) for b in s["bullets"]]
    if lesson.get("resources"):
        out.append(block("heading_3", "Resources"))
        for r in lesson["resources"]:
            out.append({"object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [
                {"type": "text", "text": {"content": r["title"], "link": {"url": r["href"]}}, "annotations": {"bold": True}},
                {"type": "text", "text": {"content": ": " + r["desc"]}}]}})
    if a: out.append(block("paragraph", "(The Action repeats here on the site, then the Save your progress box.)"))
    elif glossary: out.append(block("paragraph", "(Glossary shape: no takeaways or action. The Save your progress box follows on the site.)"))
    return out

rows = []
cur = None
while True:
    body = {"page_size": 100}
    if cur: body["start_cursor"] = cur
    r = nt(f"databases/{DB}/query", body, "POST")
    rows += r["results"]
    if not r.get("has_more"): break
    cur = r["next_cursor"]
by_num = {"".join(t["plain_text"] for t in x["properties"]["#"]["rich_text"]): x for x in rows}

for lesson in lessons:
    row = by_num.get(lesson["num"])
    if not row:
        print("no Notion row for", lesson["num"]); continue
    props = {}
    title = "".join(t["plain_text"] for t in row["properties"]["Lesson"]["title"])
    if title != lesson["title"]:
        props["Lesson"] = {"title": [{"type": "text", "text": {"content": lesson["title"]}}]}
    if lesson["status"] == "ready" and (row["properties"]["Status"]["select"] or {}).get("name") != "Live on site":
        props["Status"] = {"select": {"name": "Live on site"}}
    if props:
        nt(f"pages/{row['id']}", {"properties": props}, "PATCH")
        print(lesson["num"], "updated", list(props))
    if lesson["status"] != "ready":
        continue

    kids_ = kids(row["id"])
    after = None
    for i, b in enumerate(kids_):
        if b["type"] == "heading_2" and txt(b).startswith(TOGGLE):
            after = kids_[i - 1]["id"] if i > 0 else None
            nt(f"blocks/{b['id']}", None, "DELETE")
            break
    else:
        after = kids_[0]["id"] if kids_ and kids_[0]["type"] == "callout" else None
    toggle = {"object": "block", "type": "heading_2", "heading_2": {
        "rich_text": [{"type": "text", "text": {"content": TOGGLE}}], "is_toggleable": True,
        "children": content(lesson)}}
    body = {"children": [toggle]}
    if after: body["after"] = after
    nt(f"blocks/{row['id']}/children", body, "PATCH")
    print(lesson["num"], "synced", len(toggle["heading_2"]["children"]), "blocks")
