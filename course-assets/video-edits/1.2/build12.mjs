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
    t: "0:06 to 0:15", frame: 8, title: "Title",
    say: "There's only 24 hours in the day. This lesson is called Own Your 24.",
    wall: st(`<span class="g-pill">Lesson 1.2</span><div class="g-h big">Own Your 24</div><div class="g-l">Hands-On AI</div>`, "f-cy"),
    on: "Title sticker: Lesson 1.2, Own Your 24, Hands-On AI.",
    motion: "Drops in on \"Own Your 24\".",
    edit: "Cut the 6 seconds of quiet before you start, and \"and what you and\" (0:14).",
  },
  {
    t: "0:15 to 0:24", frame: 20, title: "Focus on one thing",
    say: "The one thing you want to focus on today is the biggest constraint in your business.",
    wall: st(`<div class="g-h">Focus on<br>one thing.</div>`, "rot-l") + tag("Your biggest constraint", "cy", 2),
    on: "\"Focus on one thing.\" Then the answer lands under it: your biggest constraint.",
  },
  {
    t: "0:24 to 0:57", frame: 33, title: "You can't see focus",
    say: "People only see the choices you made, not the options you have… You can't really witness focus. You can only see winning.",
    wall: st(`<div class="g-l">Alex Hormozi · The Diary of a CEO</div><div class="g-b" style="font-size:2.3cqw;line-height:1.2"><b>“People only see the choices you made, not the options you had.”</b></div>`) + st(`<div class="g-b">You can't see focus.<br><b>You only see winning.</b></div>`, "f-li sm rot-r"),
    on: "Quote card with the source, then \"You can't see focus. You only see winning.\"",
    edit: "Cut \"Uh\", one \"I\" and \"the diary of this\" (0:24 to 0:30). The transcript hears the name as \"Alex Ramosy\": probably the transcriber, not you. The card and captions spell it Alex Hormozi.",
  },
  {
    t: "0:57 to 1:28", frame: 75, title: "Your constraint: the part that's lagging",
    say: "The constraint is the part of the house that's lagging behind the others… If you quadrupled your business tomorrow, what would break first?",
    wall: house({ tilt: true }) + st(`<div class="g-h sm">What breaks first?</div><div class="g-b">2 leads a week becomes 20.</div>`, "callout rot-r"),
    on: "The house from 1.1 with one short pillar. Then the test: what breaks first?",
    motion: "The short pillar drops on \"lagging behind\". The callout lands on \"what would break first\".",
  },
  {
    t: "1:28 to 2:22", frame: 100, title: "Demand or supply?",
    say: "Are you supply or demand constrained? Demand constraint means you're short on customers… Most businesses are typically short on leads.",
    wall: `<div class="g-row">${st(`<div class="g-l">Demand</div><div class="g-b">Short on customers</div>`, "f-cy sm rot-l")}${st(`<div class="g-l">Supply</div><div class="g-b">Short on time and crew</div>`, "f-te sm rot-r")}</div>` + tag("Most businesses: short on leads", "li", -2),
    on: "Two stickers, Demand and Supply. Then \"Most businesses: short on leads\".",
  },
  {
    t: "2:22 to 2:48", frame: 160, title: "The pendulum",
    say: "Now you have enough leads coming in, and you can't meet the demand… So it pendulums like this.",
    wall: `<svg viewBox="0 0 300 220" style="width:82%"><line x1="150" y1="10" x2="215" y2="150" stroke="#121318" stroke-width="5"/><circle cx="150" cy="10" r="8" fill="#121318"/><circle cx="215" cy="150" r="26" fill="#03C0E8" stroke="#121318" stroke-width="5"/><path d="M40 160 Q150 230 260 160" fill="none" stroke="#121318" stroke-width="3" stroke-dasharray="7 6"/></svg><div class="g-row">${tag("Not enough leads", "cy", -3)}${tag("Can't keep up", "te", 3)}</div>`,
    on: "A pendulum swinging between \"Not enough leads\" and \"Can't keep up\".",
    motion: "It swings to each side as you describe it, matching your hand.",
  },
  {
    t: "2:48 to 3:36", frame: 190, title: "The Rubik's Cube",
    say: "That's like a Rubik's Cube where you fix one thing, but then… you fix your price sheet… mess up all your accounting.",
    wall: `<div class="g-cube">${["cy", "te", "li", "gr", "cy", "te", "li", "gr", "cy"].map((f) => `<span class="f-${f}"></span>`).join("")}</div><div class="g-row">${tag("Fix the price sheet", "te", -3)}${tag("Break the books", "li", 3)}</div>` + st(`<div class="g-b">That's what you traded<br>your job for.</div>`, "sm rot-l"),
    on: "A Rubik's Cube. \"Fix the price sheet\" and \"Break the books\". Then \"That's what you traded your job for.\"",
    motion: "The cube's rows twist once on \"fix one thing\".",
    edit: "Cut \"Okay, um, alright. So, uh, um\" (3:36 to 3:43).",
  },
  {
    t: "3:43 to 4:02", frame: 230, title: "Common constraints",
    say: "Common constraints… Alex Hormozi calls these seven deadly sins… The Game podcast, episode 894.",
    wall: st(`<div class="g-h">Common<br>constraints</div><div class="g-l">Alex Hormozi · The Game, ep. 894</div>`, "f-gr"),
    on: "Section card with the podcast source.",
  },
  {
    t: "4:02 to 4:49", frame: 262, title: "The list, part 1",
    say: "Number one, not enough leads. Number two, poor conversion… a poorly defined customer… Data, you don't know what's broken.",
    wall: st(`<ol class="g-list tight"><li><b>Not enough leads</b></li><li><b>Poor conversion</b></li><li><b>Poorly defined customer</b></li><li><b>Missing data</b></li></ol>`),
    on: "A numbered list that grows one line at a time.",
    motion: "Each line lands as you name it.",
  },
  {
    t: "4:49 to 6:18", frame: 320, title: "The list, part 2",
    say: "Wheels are falling off the bus… No profit… underpriced… one and done… It's kind of like a list, but it's also a circle.",
    wall: st(`<ol class="g-list tight" start="5"><li><b>Wheels falling off the bus</b></li><li><b>No profit</b><span>pricier techs ate it</span></li><li><b>Underpriced</b><span>can't pay good techs</span></li><li><b>One and done</b><span>loops back to not enough leads</span></li></ol>`),
    on: "The list continues 5 to 8. \"One and done\" draws an arrow back up to \"Not enough leads\".",
    motion: "The arrow draws on \"it's also a circle\".",
    edit: "Cut the restart \"That's another one. No profit. So from which you started… this is a Rubik's Cube. No,\" (5:22 to 5:30). See Needs your call #3.",
    flag: true,
  },
  {
    t: "6:18 to 6:33", frame: 380, title: "Not enough",
    say: "Not enough leads, not enough money, not enough people. Quality people, right?",
    wall: `<div class="g-stack">${tag("Not enough leads", "cy", -3)}${tag("Not enough money", "te", 2)}${tag("Not enough good people", "li", -2)}</div>`,
    on: "Three tags, one per \"not enough\".",
  },
  {
    t: "6:33 to 7:40", frame: 400, title: "It sucks to suck",
    say: "Most constraints come with a fix that hurts. You have to drop a customer type… Yes, it used to be $400, now it's $700.",
    wall: st(`<div class="g-h big">It sucks<br>to suck.</div>`, "f-li rot-l") + `<div class="g-row">${tag("Drop a customer type", "gr", -2)}${tag("Say no", "cy", 3)}${tag("$400 is now $700", "te", -3)}</div>`,
    on: "\"It sucks to suck.\" Then the fixes that hurt, as tags.",
  },
  {
    t: "7:40 to 7:58", frame: 470, title: "Not deciding is a decision",
    say: "Not deciding is a decision… It's a decision that keeps you stuck in the suck.",
    wall: st(`<div class="g-h">Not deciding<br>is a decision.</div><div class="g-l">It keeps you stuck in the suck</div>`, "f-gr"),
    on: "One sticker.",
    edit: "Cut \"Um, another, okay, so it sucks to suck, and then\" (8:02 to 8:10).",
  },
  {
    t: "8:10 to 8:44", frame: 515, title: "The shiny new thing",
    say: "Maybe we just need to open a new location, or we should have a different product… expand into commercial.",
    wall: `<div class="g-pile">${tag("New location", "cy", -6)}${tag("New product", "te", 4)}${tag("Go commercial", "li", -3)}${tag("Just new stuff", "gr", 5)}</div><div class="g-l g-under">Avoiding the thing that sucks</div>`,
    on: "Shiny new ideas pile up as you list them.",
  },
  {
    t: "8:44 to 9:33", frame: 540, title: "More or better beats new",
    say: "More or better, 98% of the time, beats new… All the best you can do is relieve the constraint a little bit.",
    wall: st(`<div class="g-h">More or better<br>beats new.</div><div class="g-l">98 times out of 100</div>`, "f-te") + st(`<div class="g-b">You don't solve a constraint.<br><b>You loosen it.</b></div>`, "sm rot-r"),
    on: "\"More or better beats new.\" Then \"You don't solve a constraint. You loosen it.\"",
  },
  {
    t: "9:33 to 10:31", frame: 615, title: "Can we do more of it?",
    say: "Can we do more of that? No. Why not? Because we're not that good at it. Let's make it better so that we can do more of it.",
    wall: `<div class="g-flow">${st(`<div class="g-b"><b>Can we do more of it?</b></div>`, "sm")}<span class="g-down">&darr; no</span>${st(`<div class="g-b"><b>Why not?</b> Make it better.</div>`, "sm f-li")}<span class="g-down">&darr;</span>${st(`<div class="g-b"><b>Then do more.</b></div>`, "sm f-te")}<span class="g-down">&darr; maxed out</span>${st(`<div class="g-b">Only then: <b>something new</b></div>`, "sm f-gr")}</div>`,
    on: "A flow that builds step by step: do more, why not, make it better, then do more, and only then something new.",
    edit: "Cut 20 seconds of quiet after \"let's add a new thing\" (10:32 to 10:51).",
  },
  {
    t: "10:53 to 12:06", frame: 690, title: "The Idea Bank",
    say: "You get ideas, you need somewhere to put them. I call it the idea bank… deposit that in the bank, and we can withdraw it later.",
    wall: `<div class="g-row">${tag("New idea", "li", -5)}${tag("A suggestion", "te", 3)}${tag("Shiny thing", "cy", -2)}</div><div class="g-box"><div class="g-h sm">Idea Bank</div><div class="g-l">Deposit now. Withdraw later.</div></div>`,
    on: "Ideas drop into the Idea Bank box, same box as in 1.1.",
    edit: "Cut \"The other thing, and I don't know.\" (12:07 to 12:11).",
  },
  {
    t: "12:11 to 13:06", frame: 765, title: "Bad days",
    say: "Some days are bad days. You don't f***ing feel like it… the whole f*** your mood, f*** your feelings, get it done anyway… or honor where you are.",
    wall: st(`<div class="g-h">Some days are<br>bad days.</div>`, "f-gr rot-l") + `<div class="g-row">${tag("Grind through it", "cy", -3)}<span class="g-eq">or</span>${tag("Honor where you are", "li", 3)}</div>`,
    on: "\"Some days are bad days.\" Then the choice: grind through it, or honor where you are.",
    edit: "Two swears here (12:16 and 12:52). See Needs your call #1.",
    flag: true,
  },
  {
    t: "13:06 to 14:12", frame: 820, title: "Fallback tasks",
    say: "I like to have fallback tasks… documenting processes, working on your SOPs, logging your ideas, cleaning out your email box.",
    wall: st(`<div class="g-l">Fallback tasks</div><ul class="g-list tight bullets"><li><b>Document a process</b></li><li><b>Work on your SOPs</b></li><li><b>Log your ideas</b></li><li><b>Clean out your inbox</b></li><li><b>Unsubscribe from stuff</b></li></ul>`),
    on: "A list that fills as you name each task.",
  },
  {
    t: "14:12 to 14:41", frame: 865, title: "Own your 24",
    say: "One project at a time. Two things that protect your project are the idea bank and your fallback tasks… Can you do more of it? Can you do what you're doing better?",
    wall: st(`<div class="g-l">Own your 24</div><ol class="g-list tight"><li><b>One project at a time</b></li><li><b>Protect it</b><span>Idea Bank + fallback tasks</span></li><li><b>More or better beats new</b></li></ol>`),
    on: "Recap card, one line per point.",
  },
  {
    t: "14:41 to 14:48", frame: 880, title: "Your action",
    say: "Very rarely should you be doing something different or new.",
    wall: st(`<span class="g-pill">Your action</span><div class="g-h">Set up your first project</div><div class="g-b">The prompt is right below.</div><div class="g-arrow">&darr;</div>`, "f-cy") + st(`<div class="g-l">Next</div><div class="g-b"><b>1.3 Job Site Prep</b></div>`, "sm rot-r"),
    on: "End card: Your action, Set up your first project. Next: 1.3 Job Site Prep.",
    motion: "Holds 3 seconds after you finish.",
    edit: "Cut the closing \"Yeah.\" You don't say the action out loud. See Needs your call #2.",
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

const html = `<title>Lesson 1.2 Storyboard</title>
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
.g-list.tight{gap:.5cqw}.g-list.tight b{font-size:1.9cqw}.g-list.tight span{font-size:1.35cqw}
.g-list.bullets{list-style:none;padding-left:0}.g-list.bullets li::before{content:"";display:inline-block;width:.9cqw;height:.9cqw;margin-right:.8cqw;border-radius:99px;background:#40E0D0;border:.2cqw solid #121318}.g-list.bullets li b{display:inline}
.g-cube{display:grid;grid-template-columns:repeat(3,4.6cqw);gap:.4cqw;padding:.6cqw;background:#121318;border-radius:1cqw;rotate:-8deg;box-shadow:.55cqw .55cqw 0 rgba(18,19,24,.4)}
.g-cube span{aspect-ratio:1;border-radius:.5cqw}
.g-stack{display:flex;flex-direction:column;align-items:center;gap:1.2cqw}
.g-flow{display:flex;flex-direction:column;align-items:center;gap:.3cqw}
.g-down{font:500 1.2cqw/1 "DM Mono",monospace;letter-spacing:.06em;text-transform:uppercase;background:var(--v-cream);border-radius:99px;padding:.3cqw .8cqw}
@media (prefers-reduced-motion:no-preference){.chip{transition:rotate .2s}}
</style>

<div class="wrap">
<header>
  <span class="label">Hands-On AI · Lesson 1.2 · Own Your 24</span>
  <h1>Lesson 1.2 storyboard</h1>
  <p class="lede">Your Nov 16 take, beat by beat, built the same way as 1.1: real frames from your recording, with each planned graphic mocked up in the empty wall on the right of the frame. Comment on any beat.</p>
  <div class="stats">
    <div class="stat"><span class="label">Raw take</span><b>14:50</b></div>
    <div class="stat f"><span class="label">After cuts</span><b>about 13:00</b></div>
    <div class="stat"><span class="label">Beats</span><b>${beats.length}</b></div>
    <div class="stat"><span class="label">Re-records needed</span><b>0</b></div>
  </div>
</header>

<section id="calls">
  <h2>Needs your call</h2>
  <div class="calls">
    <div class="call urgent" id="call-1">
      <span class="label">1 · Beat 18 · 12:16 and 12:52</span>
      <h3>Two swears</h3>
      <p>"You don't fucking feel like it" and "fuck your mood, fuck your feelings." YouTube only limits ads for swearing in the first few seconds or all the way through, so neither is a platform problem. It's a voice call.</p>
      <p class="rec">My pick: keep both. It's how you talk, it lands late in the lesson, and the second one is the point of the bit. Bleeping is the other option.</p>
    </div>
    <div class="call" id="call-2">
      <span class="label">2 · Beat 21 · 14:41</span>
      <h3>The ending</h3>
      <p>You close on "very rarely should you be doing something different or new." The action (set up your first project in Claude) and the pointer to 1.3 aren't said out loud.</p>
      <p class="rec">My pick: the end card carries both, same as 1.1.</p>
    </div>
    <div class="call" id="call-3">
      <span class="label">3 · Beat 10 · 5:19 to 5:59</span>
      <h3>No profit and Underpriced run together</h3>
      <p>The two ideas blur into one stretch, with a restart in the middle. Cutting the restart helps; the list card does the rest by giving each its own line.</p>
      <p class="rec">My pick: cut the restart, let the card split them ("pricier techs ate it" / "can't pay good techs"). No re-record.</p>
    </div>
    <div class="call" id="call-4">
      <span class="label">4 · Skipped from the script</span>
      <h3>The four "before you commit" questions</h3>
      <p>Cost up front, cost to keep up, can it be automated or delegated, does it fix two problems at once. You didn't cover them, and the take is already 13 minutes.</p>
      <p class="rec">My pick: leave them out of the video.</p>
    </div>
  </div>
</section>

<section id="zone">
  <h2>Where the graphics go</h2>
  <div class="zonedemo">
    <div class="frame"><img src="${img(300)}" alt="Frame at 5:00 with the graphics area marked"><div class="zone show"><span class="zonetag">Graphics live here</span></div><div class="safe">Kept clear for YouTube captions</div></div>
    <div>
      <p>Every graphic sits in the blank wall to the right, above the bottom third so YouTube captions never cover it. You lean into that space a few times when you gesture, so graphics stay in the upper part of the wall and use your gestures where they line up.</p>
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
      <tr><td class="t">0:00 to 0:06</td><td>Quiet before you start</td><td>Start on "There's only 24 hours".</td></tr>
      <tr><td class="t">0:14</td><td>"and what you and"</td><td>Stumble.</td></tr>
      <tr><td class="t">0:24 to 0:30</td><td>"Uh", one "I", "the diary of this"</td><td>Restarts.</td></tr>
      <tr><td class="t">0:54</td><td>"Alright" and quiet</td><td>Dead air.</td></tr>
      <tr><td class="t">3:36 to 3:43</td><td>"Okay, um, alright. So, uh, um"</td><td>Dead air.</td></tr>
      <tr><td class="t">5:22 to 5:30</td><td>"That's another one. No profit. So from which you started… this is a Rubik's Cube. No,"</td><td>Restart (Needs your call #3).</td></tr>
      <tr><td class="t">8:02 to 8:10</td><td>"Um, another, okay, so it sucks to suck, and then"</td><td>Restart.</td></tr>
      <tr><td class="t">10:32 to 10:51</td><td>20 seconds of quiet</td><td>Dead air.</td></tr>
      <tr><td class="t">12:07 to 12:11</td><td>"The other thing, and I don't know."</td><td>Restart.</td></tr>
      <tr><td class="t">14:49</td><td>"Yeah."</td><td>End on your last line.</td></tr>
      <tr><td class="t">Throughout</td><td>Pauses over 1 second, trimmed to half a second</td><td>Pace.</td></tr>
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

fs.writeFileSync(`${dir}lesson-1-2-storyboard.html`, html);
console.log("wrote", (html.length / 1024).toFixed(0) + "KB");
