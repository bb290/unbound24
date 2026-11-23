// Builds the Lesson 1.1 storyboard page (storyboard.html) from frames in sb/.
import fs from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const img = (t) => "data:image/jpeg;base64," + fs.readFileSync(`${dir}sb/f${t}.jpg`).toString("base64");

/* ---------- the house, drawn in SVG ---------- */
const INK = "#121318", CREAM = "#FFFBF4";
const FILL = { C: "#03C0E8", O: "#40E0D0", D: "#D3D3FF", E: "#C4C4C4" };
function house({ found = "fill", pillars = "code", hi = null, roof = "fill", dashed = false, tilt = false, roofText = "BRAND" } = {}) {
  const sh = (el, on = true) => (on && !dashed ? el.replace("<rect", `<rect transform="translate(5 5)" fill="${INK}" stroke="none"`).replace(/fill="[^"]*" stroke="[^"]*"/, "") : "");
  const stroke = dashed ? `stroke="${INK}" stroke-width="3" stroke-dasharray="8 6"` : `stroke="${INK}" stroke-width="3.5"`;
  let s = "";
  // foundation
  if (found !== "none") {
    const f = found === "dash" || dashed ? "none" : "url(#cement)";
    if (found === "fill" && !dashed) s += `<rect x="19" y="249" width="292" height="40" rx="6" fill="${INK}"/>`;
    s += `<rect x="14" y="244" width="292" height="40" rx="6" fill="${f}" ${found === "dash" ? `stroke="${INK}" stroke-width="3" stroke-dasharray="8 6"` : stroke}/>`;
    if (found === "fill" && !dashed) s += `<text x="160" y="269" text-anchor="middle" font-family="DM Mono, monospace" font-size="13" font-weight="500" letter-spacing="1.5" fill="${INK}">DOCUMENTATION + DATA</text>`;
  }
  // pillars
  if (pillars !== "none") {
    ["C", "O", "D", "E"].forEach((L, i) => {
      const x = 30 + i * 70, top = tilt && L === "E" ? 196 : 128, h = 238 - top;
      const faded = hi && hi !== L;
      const fill = dashed || pillars === "blank" ? (dashed ? "none" : CREAM) : faded ? CREAM : FILL[L];
      const op = faded ? ' opacity="0.4"' : "";
      s += `<g${op}>`;
      if (!dashed) s += `<rect x="${x + 5}" y="${top + 5}" width="50" height="${h}" rx="6" fill="${INK}"/>`;
      s += `<rect x="${x}" y="${top}" width="50" height="${h}" rx="6" fill="${fill}" ${stroke}/>`;
      if (pillars === "code" && !dashed) s += `<text x="${x + 25}" y="${top + h / 2 + 13}" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="800" font-size="38" fill="${INK}">${L}</text>`;
      s += `</g>`;
    });
  }
  // roof
  if (roof !== "none") {
    const t = tilt ? ' transform="rotate(13 14 120)"' : "";
    s += `<g${t}>`;
    if (roof === "fill" && !dashed) s += `<polygon points="19,125 165,37 311,125" fill="${INK}" opacity="0.35"/>`;
    s += `<polygon points="14,120 160,32 306,120" fill="${roof === "fill" && !dashed ? INK : "none"}" ${roof === "dash" ? `stroke="${INK}" stroke-width="3" stroke-dasharray="8 6"` : stroke} stroke-linejoin="round"/>`;
    if (roof === "fill" && !dashed && roofText) s += `<text x="160" y="100" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="800" font-size="30" letter-spacing="1" fill="#F8F0E3">${roofText}</text>`;
    s += `</g>`;
  }
  return `<svg class="g-house" viewBox="0 0 320 300" role="img" aria-label="House diagram"><defs><pattern id="cement" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#F0E5D2"/><circle cx="2" cy="2" r="1" fill="#C4C4C4"/><circle cx="6" cy="6" r="0.8" fill="#C4C4C4"/></pattern></defs>${s}</svg>`;
}

const st = (inner, cls = "") => `<div class="g-st ${cls}">${inner}</div>`;
const tag = (t, fill = "cy", rot = 0) => `<span class="g-tag f-${fill}" style="rotate:${rot}deg">${t}</span>`;

/* ---------- beats ---------- */
// t = raw timestamps in Brittany's Vids recording. frame = second the still is taken from.
const beats = [
  {
    t: "0:01 to 0:23", frame: 8, title: "Cold open: no blueprint",
    say: "Imagine you're building a house without a blueprint… You run to Home Depot every other half hour.",
    wall: st(`<div class="g-l">The plan</div><div class="g-h">No blueprint.<br>Just vibes.</div>`, "rot-l") + st(`<div class="g-l">Hardware store trips today</div><div class="g-num">14</div>`, "f-li rot-r sm"),
    on: "Sticker: \"No blueprint. Just vibes.\" A second sticker counts hardware-store trips.",
    motion: "The counter ticks up 1 to 14 on \"every other half hour\".",
    edit: "Cut the opening \"Okay.\" so it starts on \"Imagine\".",
  },
  {
    t: "0:23 to 0:39", frame: 33, title: "This is how you're building your business",
    say: "A lot of YouTube videos, a lot of Instagram reels, and you just patchwork it all together.",
    wall: `<div class="g-pile">${tag("YouTube video", "cy", -6)}${tag("Instagram reel", "te", 4)}${tag("Another reel", "li", -3)}${tag("A guy's podcast", "gr", 6)}${tag("Your cousin's advice", "cy", -2)}</div><div class="g-l g-under">Your current plan</div>`,
    on: "Tags pile up at angles, like a patchwork.",
    motion: "One tag lands on each \"a lot of…\".",
  },
  {
    t: "0:39 to 0:51", frame: 44, title: "Title",
    say: "Not anymore. I'm gonna give you a plan.",
    wall: st(`<span class="g-pill">Lesson 1.1</span><div class="g-h big">Business<br>Breakdown</div><div class="g-l">Hands-On AI</div>`, "f-cy"),
    on: "Title sticker: Lesson 1.1, Business Breakdown, Hands-On AI.",
    motion: "The patchwork tags get swept off. The title drops in on \"Not anymore.\"",
  },
  {
    t: "0:51 to 1:37", frame: 75, title: "What we're building: 3 goals",
    say: "One, consistent qualified leads… Two, five-star service… And three, this is the part everybody skips…",
    wall: st(`<div class="g-l">What we're building</div><ol class="g-list"><li><b>Qualified leads</b><span>ready to pay market rate</span></li><li><b>Five-star work</b><span>reviews, repeat jobs, referrals</span></li><li class="hl"><b>A good job for everyone</b><span>including you, the owner</span></li></ol>`) + `<span class="g-tag f-li g-note" style="rotate:-5deg">The part everybody skips</span>`,
    on: "A checklist that builds one goal at a time. Goal 3 gets a lilac highlight and a \"part everybody skips\" sticker.",
    motion: "Each line appears as you say \"One\", \"Two\", \"Three\".",
  },
  {
    t: "1:37 to 1:48", frame: 100, title: "Your business is a house",
    say: "Your business is a house. We're gonna build a house with a plan, and we're gonna build it to code.",
    wall: house({ dashed: true, found: "dash", roof: "dash", pillars: "blank" }) + `<div class="g-l g-under">Built to code</div>`,
    on: "The outline of the house, all dashed, like a blueprint.",
    motion: "Lines draw on.",
  },
  {
    t: "1:48 to 2:18", frame: 125, title: "Foundation: documentation + data",
    say: "Your foundation is made up of documentation and data. Very boring, just like cement.",
    wall: house({ found: "fill", pillars: "none", roof: "none" }) + st(`<div class="g-h sm">Foundation</div><div class="g-b">Every process written down.<br>Numbers you track.</div>`, "rot-l callout"),
    on: "The foundation fills in cement-gray, labeled Documentation + Data.",
    motion: "The slab pours in left to right on \"just like cement\".",
  },
  {
    t: "2:18 to 2:50", frame: 145, title: "Four pillars, built to CODE",
    say: "There's four, like cornerstones of this square house… I call them code. C, O, D, E.",
    wall: house({ found: "fill", pillars: "code", roof: "none" }),
    on: "Four blank pillars rise. C, O, D, E stamp onto them one by one.",
    motion: "One letter per letter you say.",
    edit: "Cut \"Um\" and the 9-second pause plus \"these four pillars are labeled\" (2:30 to 2:41). Cut \"Co, uh, C\" (2:50).",
  },
  {
    t: "2:50 to 3:07", frame: 175, title: "C: Capture",
    say: "C, capture. Capture people's attention, get them to your website.",
    wall: house({ hi: "C", roof: "none" }) + st(`<div class="g-h sm">Capture</div><div class="g-b">Get their attention.<br>Bring in leads.</div>`, "f-cy callout"),
    on: "C lights up cyan, the others fade. Callout: Capture.",
  },
  {
    t: "3:07 to 3:27", frame: 200, title: "O: Obtain",
    say: "Obtain. Turn those leads into paying customers. Aka your sales process.",
    wall: house({ hi: "O", roof: "none" }) + st(`<div class="g-h sm">Obtain</div><div class="g-b">Leads into paying customers.<br><i>aka your sales process</i></div>`, "f-te callout"),
    on: "O lights up teal. Callout: Obtain.",
  },
  {
    t: "3:27 to 3:46", frame: 218, title: "D: Deliver",
    say: "Deliver the service that you sold… every job is done the same great way every single time.",
    wall: house({ hi: "D", roof: "none" }) + st(`<div class="g-h sm">Deliver</div><div class="g-b">Great work. Great experience.<br>Same way every time.</div>`, "f-li callout"),
    on: "D lights up lilac. Callout: Deliver.",
  },
  {
    t: "3:46 to 4:43", frame: 245, title: "E: Extend, the four Rs",
    say: "Extend, keep the relationship going after the job is done… it breaks down into four R's.",
    wall: `<div class="g-l">E is for Extend</div><div class="g-grid">${tag("Refine", "gr", -3)}${tag("Review", "cy", 2)}${tag("Refer", "te", -2)}${tag("Repeat", "li", 3)}</div>` + st(`<div class="g-b"><b>Review:</b> ask every customer.</div>`, "sm rot-r"),
    on: "Four R tags, one per R as you name it. Under Review, the graphic says \"ask every customer\" (see Needs your call #1).",
    motion: "Each R pops on as you say it.",
    edit: "Cut \"or five\" (3:59). Cut the review-gating line (4:08 to 4:13): see Needs your call #1.",
    flag: true,
  },
  {
    t: "4:43 to 5:43", frame: null, title: "CUT: first roof take",
    say: "\"The roof is a brand… the four V's, visual, voice, values, and something else.\" Then 30 seconds of quiet.",
    on: "Nothing. This whole minute comes out. Your second take at 5:43 is clean and says three V's.",
    cut: true,
  },
  {
    t: "5:43 to 6:21", frame: 365, title: "Roof: Brand (the three V's)",
    say: "The roof is supported by everything below it, and it also protects everything under it… visual, voice, and values.",
    wall: house({ roof: "fill" }) + `<div class="g-row">${tag("Visual", "cy", -3)}${tag("Voice", "te", 2)}${tag("Values", "li", -2)}</div>`,
    on: "The roof drops onto the pillars, labeled Brand. Three V tags appear under it.",
    motion: "Roof lands with a small bounce on \"the roof\". Tags on each V.",
  },
  {
    t: "6:21 to 6:28", frame: 384, title: "The whole house",
    say: "That's like the basic structure of a business. Foundation, pillars, roof.",
    wall: house({}) + `<div class="g-l g-under">Foundation. Pillars. Roof.</div>`,
    on: "The full house, all colors on. This is the frame people screenshot.",
    edit: "Cut \"Alright\" and the 7 seconds of quiet after it (6:28 to 6:36).",
  },
  {
    t: "6:36 to 7:23", frame: 410, title: "A thousand things to do",
    say: "You need to do your website, you need to do your books, I need to send my invoices, I need to redo my price sheet…",
    wall: `<div class="g-notes">${["Website", "Books", "Invoices", "Price sheet", "Reviews", "Shingle colors", "Socials", "Accounting", "Emails", "TikTok?"].map((n, i) => `<span class="g-sticky f-${["li", "te", "cy", "gr"][i % 4]}" style="rotate:${[-6, 4, -2, 7, -5, 3, -7, 5, -3, 6][i]}deg">${n}</span>`).join("")}</div>`,
    on: "Sticky notes pile up until they cover the whole wall.",
    motion: "Each note lands as you say it, faster and faster. The pile shakes a little on \"the urgency is so intense\".",
    edit: "Cut the stumble \"You need to set up your, your clock, your, you know\" (6:47 to 6:53).",
  },
  {
    t: "7:23 to 8:08", frame: 460, title: "Slow down. Structure first.",
    say: "Would a built out TikTok account help your business? Maybe. But that's literally like installing a hot tub when you don't even have walls.",
    wall: st(`<div class="g-h">Slow down.<br>Focus.</div>`, "f-te") + `<div class="g-row">${tag("Built-out TikTok", "gr", -4)}<span class="g-eq">=</span>${tag("Hot tub, no walls", "li", 3)}</div>`,
    on: "The sticky notes fall off the wall, leaving \"Slow down. Focus.\" Then the TikTok = hot tub sticker.",
    motion: "All notes drop off on \"slow down\".",
  },
  {
    t: "8:10 to 8:32", frame: 500, title: "Save the ideas for later",
    say: "I want a hot tub, I want a pergola, I want a fire pit… Save them, and we'll do them later.",
    wall: `<div class="g-row">${tag("Hot tub", "li", -5)}${tag("Pergola", "te", 3)}${tag("Fire pit", "cy", -2)}</div><div class="g-box"><div class="g-h sm">Idea Bank</div><div class="g-l">Lesson 1.2</div></div>`,
    on: "Hot tub, Pergola and Fire pit drop into a box labeled Idea Bank, Lesson 1.2.",
    motion: "Each idea drops into the box as you name it.",
    edit: "You don't say \"Idea Bank\" here. The label links it to 1.2 on screen only: see Needs your call #2.",
    flag: true,
  },
  {
    t: "8:44 to 9:43", frame: 545, title: "Brick by brick",
    say: "You build it one brick at a time, one board at a time… a quality job of that specific job, and once that's done, we move on to the next thing.",
    wall: `<div class="g-bricks">${Array.from({ length: 15 }, (_, i) => `<span class="${i < 10 ? "on" : i === 10 ? "now" : ""}"></span>`).join("")}</div><div class="g-h sm g-under">One brick at a time.</div>`,
    on: "A wall of bricks filling in one at a time. The current brick is highlighted cyan.",
    motion: "A brick lands every second or two through the whole beat.",
    edit: "Cut the 12-second pause before (8:32 to 8:44). Cut the false start \"So, and you also know the better\" (9:17 to 9:22).",
  },
  {
    t: "9:43 to 10:20", frame: 608, title: "Right order. In balance.",
    say: "You can't build three pillars that are like 12 feet, and then the fourth one is like three feet, because then your house gonna look like this.",
    wall: house({ tilt: true }) + `<div class="g-row">${tag("Right order", "te", -2)}${tag("In balance", "cy", 2)}</div>`,
    on: "The house with a short E pillar and a tilted roof, matching your hand gesture. Then it levels out.",
    motion: "The roof tips on \"look like this\" (your hand does the same thing), then straightens on \"everything has to be done in balance\".",
    edit: "Cut \"and that things are relatively imbalanced\" (9:48): you meant in balance, and it says the opposite. Cut the 10-second pause (9:54 to 10:04).",
  },
  {
    t: "10:20 to 11:18", frame: 650, title: "AI is a power tool",
    say: "If you are not using AI to help you build this house, you are building this entire house with hand tools.",
    wall: `<div class="g-row">${st(`<div class="g-l">Hand tools</div><div class="g-b">Hand saw every board</div>`, "f-gr sm rot-l")}${st(`<div class="g-l">Power tools</div><div class="g-b"><b>AI</b></div>`, "f-cy sm rot-r")}</div>` + st(`<div class="g-b">A drill doesn't install the cabinet.<br><b>You do. Just faster.</b></div>`),
    on: "Hand tools vs Power tools stickers, then the drill line.",
    motion: "The drill line appears on \"any more than a drill is going to install a cabinet\".",
    edit: "Cut \"it will take, I don't even know how much longer… I don't know\" (10:41 to 10:53).",
  },
  {
    t: "11:18 to 11:55", frame: 705, title: "How this course works",
    say: "One, think of business like a house. Two, AI is a power tool. And three, I want the whole thing to be hands-on.",
    wall: st(`<div class="g-l">How this course works</div><ol class="g-list"><li><b>Your business is a house</b></li><li><b>AI is a power tool</b></li><li><b>Hands-on</b><span>the way you learned your trade</span></li></ol>`),
    on: "Three-line list, one line per number.",
    edit: "Cut the 7-second pause and the restart \"So this entire course is designed\" (11:18 to 11:29).",
  },
  {
    t: "11:55 to 12:05", frame: 718, title: "Your action",
    say: "Right below is a prompt and you can get right in to using AI to help you build your business.",
    wall: st(`<span class="g-pill">Your action</span><div class="g-h">Set up your Claude</div><div class="g-b">The prompt is right below.</div><div class="g-arrow">&darr;</div>`, "f-cy"),
    on: "End card: Your action, Set up your Claude, with an arrow down to the prompt.",
    motion: "Holds 3 seconds after you finish.",
    edit: "You don't say \"see you in the next lesson\". The end card can carry \"Next: 1.2 Own Your 24\". See Needs your call #4.",
  },
];

/* ---------- page ---------- */
const beatHTML = beats.map((b, i) => {
  const n = String(i + 1).padStart(2, "0");
  const frame = b.cut
    ? `<div class="frame cutframe"><div class="cutlabel">Cut<br><span>about 1:00 removed</span></div></div>`
    : `<div class="frame"><img src="${img(b.frame)}" alt="Frame at ${b.t.split(" ")[0]}"><div class="zone">${b.wall}</div></div>`;
  return `<article class="beat${b.cut ? " is-cut" : ""}${b.flag ? " is-flag" : ""}" id="beat-${n}">
  ${frame}
  <div class="notes">
    <div class="meta"><span class="num">${n}</span><span class="time">${b.t}</span>${b.flag ? '<span class="chip">Needs your call</span>' : ""}</div>
    <h3>${b.title}</h3>
    <blockquote>${b.say}</blockquote>
    <dl>
      <dt>On the wall</dt><dd>${b.on}</dd>
      ${b.motion ? `<dt>Motion</dt><dd>${b.motion}</dd>` : ""}
      ${b.edit ? `<dt>Edit</dt><dd>${b.edit}</dd>` : ""}
    </dl>
  </div>
</article>`;
}).join("\n");

const html = `<title>Lesson 1.1 Storyboard</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Rubik:wght@700;800&display=swap">
<style>
/* Layout: one reading column; each beat is a frame (the real video still with the planned graphic in the wall space) beside its notes. Unbound design system (DESIGN.md). */
:root{
  --bg:#F8F0E3; --surface:#FFFBF4; --surface-2:#F0E5D2; --line:#E2D6C1; --border:#121318; --shadow:#121318;
  --text:#121318; --muted:#55514A; --cyan:#03C0E8; --teal:#40E0D0; --lilac:#D3D3FF; --gray:#C4C4C4; --alert:#FF7A59; --on-fill:#121318;
  --display:Rubik, ui-rounded, system-ui, sans-serif; --body:Figtree, system-ui, sans-serif; --mono:"DM Mono", ui-monospace, Menlo, monospace;
  /* graphics on the video: fixed colors, same in both page themes */
  --v-ink:#121318; --v-cream:#FFFBF4;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#121318;--surface:#1B1C23;--surface-2:#24252E;--line:#2E2F39;--border:#F8F0E3;--shadow:#3A3B46;--text:#F8F0E3;--muted:#B8B1A5;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#121318;--surface:#1B1C23;--surface-2:#24252E;--line:#2E2F39;--border:#F8F0E3;--shadow:#3A3B46;--text:#F8F0E3;--muted:#B8B1A5;color-scheme:dark}
body{background:var(--bg);color:var(--text);font:400 16px/1.55 var(--body)}
.wrap{max-width:1180px;margin:0 auto;padding-block:40px 96px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);font-weight:800;text-wrap:balance;margin:0}
h1{font-size:clamp(38px,6vw,56px);line-height:1;letter-spacing:-.02em}
h2{font-size:clamp(26px,3.4vw,30px);line-height:1.1;letter-spacing:-.01em;margin-bottom:16px}
h3{font-size:22px;line-height:1.2;font-weight:700}
.label{font:500 12px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
header{display:grid;gap:16px;margin-bottom:40px}
.lede{font-size:18px;max-width:68ch;margin:0}
.stats{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
.stat{background:var(--surface);border:2px solid var(--border);border-radius:20px;box-shadow:4px 4px 0 var(--shadow);padding:12px 18px;min-width:150px}
.stat b{display:block;font:800 30px/1 var(--display);font-variant-numeric:tabular-nums}
.stat.f{background:var(--cyan);color:var(--on-fill);border-color:#121318}
.stat.f .label{color:var(--on-fill)}
section{margin-top:56px}
.calls{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.call{background:var(--surface);border:2px solid var(--border);border-radius:20px;padding:20px 22px;box-shadow:4px 4px 0 var(--shadow);display:flex;flex-direction:column;gap:8px;min-width:0}
.call.urgent{background:var(--lilac);color:var(--on-fill);border-color:#121318}
.call.urgent .label{color:#55514A}
.call h3{font-size:19px}
.call p{margin:0}
.rec{font-weight:600}
.zonedemo{display:grid;gap:24px;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:center}
.zonedemo p{margin:0 0 10px}
table{border-collapse:collapse;width:100%;font-size:15px}
.tablebox{overflow-x:auto;border:1px solid var(--line);border-radius:20px;background:var(--surface)}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top}
th{font:500 12px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
td.t{font-family:var(--mono);font-size:14px;white-space:nowrap;font-variant-numeric:tabular-nums}
tr:last-child td{border-bottom:0}
.beats{display:grid;gap:28px}
.beat{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:24px;align-items:start;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:16px}
.beat.is-flag{border:2px solid var(--border);box-shadow:4px 4px 0 var(--shadow)}
.beat.is-cut{background:var(--surface-2)}
.notes{display:flex;flex-direction:column;gap:10px;min-width:0;padding:4px 4px 4px 0}
.meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.num{font:800 15px/1 var(--display);background:var(--text);color:var(--bg);border-radius:999px;padding:6px 10px}
.time{font:500 13px/1 var(--mono);color:var(--muted);font-variant-numeric:tabular-nums}
.chip{font:600 13px/1 var(--body);background:var(--lilac);color:var(--on-fill);border:2px solid #121318;border-radius:999px;padding:5px 10px;rotate:-2deg}
blockquote{margin:0;padding-left:12px;border-left:3px solid var(--teal);color:var(--muted);font-style:italic}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px}
dt{font:500 11px/1.9 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
dd{margin:0}
@media (max-width:820px){.beat,.zonedemo{grid-template-columns:1fr}}

/* ---------- the video frame and its graphics (sized to the frame) ---------- */
.frame{position:relative;aspect-ratio:16/9;max-width:100%;border-radius:12px;overflow:hidden;container-type:inline-size;background:#222;border:2px solid var(--border)}
.frame img{display:block;width:100%;height:100%;object-fit:cover}
.cutframe{display:grid;place-items:center;background:repeating-linear-gradient(-45deg,var(--surface-2) 0 14px,var(--surface) 14px 28px)}
.cutlabel{font:800 9cqw/1 var(--display);text-align:center;color:var(--text)}
.cutlabel span{font:500 2.4cqw/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.zone{position:absolute;left:63%;top:5%;width:34%;height:57%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1.4cqw;color:var(--v-ink);text-align:left}
.zone.show{outline:.35cqw dashed var(--cyan);outline-offset:.4cqw;border-radius:1cqw;background:rgba(3,192,232,.12)}
.safe{position:absolute;left:0;right:0;top:66.7%;bottom:0;background:rgba(18,19,24,.55);display:grid;place-items:center;font:500 2cqw/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:#F8F0E3}
.zonetag{font:700 2.4cqw/1.2 var(--display);color:var(--v-ink);background:var(--cyan);border:.3cqw solid var(--v-ink);border-radius:99px;padding:.6cqw 1.6cqw}
.g-st{background:var(--v-cream);border:.28cqw solid var(--v-ink);border-radius:1.5cqw;box-shadow:.55cqw .55cqw 0 var(--v-ink);padding:1.2cqw 1.7cqw;display:flex;flex-direction:column;gap:.6cqw;max-width:100%}
.g-st.sm{padding:.9cqw 1.3cqw}
.g-st.callout{position:absolute;right:-1cqw;top:-.5cqw;max-width:62%}
.rot-l{rotate:-2deg}.rot-r{rotate:2deg}
.f-cy{background:#03C0E8}.f-te{background:#40E0D0}.f-li{background:#D3D3FF}.f-gr{background:#C4C4C4}
.g-h{font:800 3.6cqw/1 Rubik,sans-serif;letter-spacing:-.02em}
.g-h.big{font-size:4.6cqw}.g-h.sm{font-size:2.6cqw}
.g-b{font:500 1.75cqw/1.3 Figtree,sans-serif}
.g-l{font:500 1.25cqw/1.2 "DM Mono",monospace;letter-spacing:.08em;text-transform:uppercase}
.g-num{font:800 6cqw/1 Rubik,sans-serif}
.g-pill{align-self:flex-start;font:500 1.3cqw/1 "DM Mono",monospace;letter-spacing:.08em;text-transform:uppercase;background:var(--v-ink);color:#F8F0E3;border-radius:99px;padding:.6cqw 1.2cqw}
.g-tag{display:inline-block;white-space:nowrap;border:.28cqw solid var(--v-ink);border-radius:99px;padding:.55cqw 1.4cqw;font:700 1.8cqw/1.1 Figtree,sans-serif;box-shadow:.4cqw .4cqw 0 var(--v-ink);color:var(--v-ink)}
.g-note{position:absolute;bottom:-1cqw;right:0}
.g-pile{display:flex;flex-wrap:wrap;justify-content:center;gap:1cqw .6cqw;max-width:95%}
.g-under{margin-top:.4cqw;background:var(--v-cream);padding:.4cqw 1cqw;border-radius:.6cqw}
.g-list{margin:0;padding-left:2.4cqw;display:grid;gap:.8cqw;font:500 1.75cqw/1.2 Figtree,sans-serif}
.g-list b{display:block;font:800 2.2cqw/1.1 Rubik,sans-serif}
.g-list span{font-size:1.5cqw}
.g-list li.hl b{background:#D3D3FF;box-shadow:0 0 0 .4cqw #D3D3FF;border-radius:.3cqw}
.g-house{width:78%;height:auto;overflow:visible}
.g-row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:1cqw}
.g-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.4cqw 1.2cqw}
.g-eq{font:800 3cqw/1 Rubik,sans-serif;background:var(--v-cream);border-radius:99px;padding:0 .8cqw}
.g-notes{display:grid;grid-template-columns:repeat(4,1fr);gap:.9cqw;width:100%}
.g-sticky{display:grid;place-items:center;text-align:center;aspect-ratio:1;border:.25cqw solid var(--v-ink);box-shadow:.4cqw .4cqw 0 var(--v-ink);font:700 1.6cqw/1.1 Figtree,sans-serif;padding:.5cqw;color:var(--v-ink)}
.g-box{background:var(--v-cream);border:.28cqw solid var(--v-ink);border-top-width:1.2cqw;border-radius:0 0 1.5cqw 1.5cqw;box-shadow:.55cqw .55cqw 0 var(--v-ink);padding:1.4cqw 3cqw;text-align:center;display:grid;gap:.5cqw}
.g-bricks{display:grid;grid-template-columns:repeat(5,1fr);gap:.6cqw;width:88%;direction:rtl;transform:scaleY(-1)}
.g-bricks span{height:3.2cqw;border:.25cqw dashed rgba(18,19,24,.35);border-radius:.4cqw}
.g-bricks span.on{background:#C4C4C4;border:.25cqw solid var(--v-ink)}
.g-bricks span.now{background:#03C0E8;border:.25cqw solid var(--v-ink);box-shadow:.4cqw .4cqw 0 var(--v-ink)}
.g-arrow{font:800 5cqw/1 Rubik,sans-serif;align-self:center}
@media (prefers-reduced-motion:no-preference){.chip{transition:rotate .2s}}
</style>

<div class="wrap">
<header>
  <span class="label">Hands-On AI · Lesson 1.1 · Business Breakdown</span>
  <h1>Lesson 1.1 storyboard</h1>
  <p class="lede">Your Nov 16 take, beat by beat. Each still is a real frame from your recording, with the planned graphic mocked up in the empty wall on the right of the frame. Comment on any beat. Nothing gets built until you've had your say.</p>
  <div class="stats">
    <div class="stat"><span class="label">Raw take</span><b>12:05</b></div>
    <div class="stat f"><span class="label">After cuts</span><b>about 9:30</b></div>
    <div class="stat"><span class="label">Beats</span><b>${beats.filter((b) => !b.cut).length}</b></div>
    <div class="stat"><span class="label">Re-records needed</span><b>0</b></div>
  </div>
</header>

<section id="calls">
  <h2>Needs your call</h2>
  <div class="calls">
    <div class="call urgent" id="call-1">
      <span class="label">1 · Beat 11 · 4:08</span>
      <h3>The review line is review gating</h3>
      <p>You say "ask our happy customers for five star reviews" and "not ask our unhappy customers." Google's review policy bans selectively asking for positive reviews, and it's a stance we say we don't cross. My script had the "happy customers" wording too, so that's on me.</p>
      <p class="rec">My pick: keep just "Review." and cut the rest of that sentence. The graphic says "ask every customer." No re-record.</p>
    </div>
    <div class="call" id="call-2">
      <span class="label">2 · Beat 17 · 8:10</span>
      <h3>Name the Idea Bank on screen?</h3>
      <p>You describe saving ideas but don't say "Idea Bank" or point to 1.2. A label on the box ties it to the next lesson without changing what you said.</p>
      <p class="rec">My pick: label it "Idea Bank · Lesson 1.2".</p>
    </div>
    <div class="call" id="call-3">
      <span class="label">3 · Beats 6 to 13</span>
      <h3>Course names on the pillars?</h3>
      <p>The script tied each part to its course (Get It Out of Your Head, Book the Right Customers…). You skipped those, which kept it moving.</p>
      <p class="rec">My pick: leave them off. 1.1 is the big picture; the course list lives on the site.</p>
    </div>
    <div class="call" id="call-4">
      <span class="label">4 · Beat 22 · 11:55</span>
      <h3>The ending</h3>
      <p>You end on "right below is a prompt." No "see you in the next lesson", and the Claude Pro sign-up isn't said out loud.</p>
      <p class="rec">My pick: the end card carries it: "Set up your Claude", then "Next: 1.2 Own Your 24".</p>
    </div>
  </div>
</section>

<section id="zone">
  <h2>Where the graphics go</h2>
  <div class="zonedemo">
    <div class="frame"><img src="${img(155)}" alt="Frame at 2:35 with the graphics area marked"><div class="zone show"><span class="zonetag">Graphics live here</span></div><div class="safe">Kept clear for YouTube captions</div></div>
    <div>
      <p>Every graphic sits in the blank wall to the right, above the bottom third so YouTube captions never cover it. You lean into that space a few times (your hands at 10:08, for one), so graphics stay in the upper part of the wall and use your gestures where they line up.</p>
      <p>Style is the new Unbound brand: black text, cyan, teal, lilac and gray fills, sticker shapes with hard shadows, Rubik headlines. No full-screen slides; you stay on camera the whole time.</p>
      <p class="label">Captions: YouTube closed captions from the transcript, not burned in.</p>
    </div>
  </div>
</section>

<section id="cuts">
  <h2>Cuts</h2>
  <div class="tablebox"><table>
    <thead><tr><th>Raw time</th><th>What comes out</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td class="t">0:00</td><td>"Okay."</td><td>Start on "Imagine".</td></tr>
      <tr><td class="t">2:30 to 2:41</td><td>"Um", 6 seconds of quiet, "and these four pillars are labeled"</td><td>Dead air and a restart.</td></tr>
      <tr><td class="t">2:50</td><td>"Co, uh, C."</td><td>Stumble.</td></tr>
      <tr><td class="t">3:59</td><td>"or five"</td><td>It's four Rs.</td></tr>
      <tr><td class="t">4:08 to 4:13</td><td>"We're gonna ask our happy customers for five star reviews. We're gonna not ask our unhappy customers for reviews"</td><td>Review gating (Needs your call #1).</td></tr>
      <tr><td class="t">4:43 to 5:43</td><td>First roof take, "four V's… and something else", 30 seconds of quiet</td><td>Your second take is clean.</td></tr>
      <tr><td class="t">6:28 to 6:36</td><td>"Alright" and quiet</td><td>Dead air.</td></tr>
      <tr><td class="t">6:47 to 6:53</td><td>"You need to set up your, your clock, your, you know"</td><td>Stumble.</td></tr>
      <tr><td class="t">8:32 to 8:44</td><td>Quiet</td><td>Dead air.</td></tr>
      <tr><td class="t">9:17 to 9:22</td><td>"So, and you also know the better"</td><td>False start.</td></tr>
      <tr><td class="t">9:48</td><td>"and that things are relatively imbalanced"</td><td>Says the opposite of what you meant.</td></tr>
      <tr><td class="t">9:54 to 10:04</td><td>Quiet</td><td>Dead air.</td></tr>
      <tr><td class="t">10:41 to 10:53</td><td>"It will take, I don't even know how much longer… I don't know."</td><td>Trails off.</td></tr>
      <tr><td class="t">11:18 to 11:29</td><td>Quiet, "So this entire course is designed."</td><td>Restart.</td></tr>
    </tbody>
  </table></div>
</section>

<section id="storyboard">
  <h2>Beat by beat</h2>
  <div class="beats">
${beatHTML}
  </div>
</section>
</div>`;

fs.writeFileSync(`${dir}storyboard.html`, html);
console.log("wrote", (html.length / 1024).toFixed(0) + "KB");
