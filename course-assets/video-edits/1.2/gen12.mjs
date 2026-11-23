// Generates the HyperFrames project for Lesson 1.1 (hf/): index.html + one overlay scene per beat.
// Cue times are written as raw times in Brittany's Vids take (word lookups in transcript.json) and remapped
// onto the tightened cut (keep.json), so a change to the cut list re-times every graphic.
import fs from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const words = JSON.parse(fs.readFileSync(dir + "transcript.json", "utf8"));
const keep = JSON.parse(fs.readFileSync(dir + "keep.json", "utf8")).keep;
const PAD = 3; // end-card hold added after the last frame
const TOTAL = +keep.reduce((s, [a, b]) => s + (b - a), 0).toFixed(3) + PAD;

function remap(t) {
  let acc = 0;
  for (const [a, b] of keep) {
    if (t < a) return acc;
    if (t <= b) return acc + (t - a);
    acc += b - a;
  }
  return acc;
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
/** Raw start time of `word` nearest to `near` (seconds in the raw take). */
function at(word, near) {
  const c = words.filter((w) => norm(w.text) === norm(word) && Math.abs(w.start - near) < 4);
  if (!c.length) throw new Error(`word "${word}" not found near ${near}`);
  return c.sort((x, y) => Math.abs(x.start - near) - Math.abs(y.start - near))[0].start;
}

/* ---------- shared look (Unbound DESIGN.md) ---------- */
const CSS = `
@font-face{font-family:"Rubik";src:url('assets/fonts/rubik.woff2') format('woff2');font-weight:300 900}
@font-face{font-family:"Figtree";src:url('assets/fonts/figtree.woff2') format('woff2');font-weight:300 900}
@font-face{font-family:"DM Mono";src:url('assets/fonts/dmmono-400.woff2') format('woff2');font-weight:400}
@font-face{font-family:"DM Mono";src:url('assets/fonts/dmmono-500.woff2') format('woff2');font-weight:500}
#root{position:absolute;inset:0;background:transparent}
/* the blank wall right of Brittany, above the caption third (nothing below y=670) */
.zone{position:absolute;left:1210px;top:54px;width:653px;height:616px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;color:#121318}
.st{background:#FFFBF4;border:5px solid #121318;border-radius:28px;box-shadow:10px 10px 0 #121318;padding:24px 32px;display:flex;flex-direction:column;gap:12px}
.sm{padding:18px 24px}
.cy{background:#03C0E8}.te{background:#40E0D0}.li{background:#D3D3FF}.gr{background:#C4C4C4}
.h{font:800 68px/1 "Rubik";letter-spacing:-.02em}
.h.big{font-size:88px}.h.md{font-size:52px}
.b{font:500 34px/1.25 "Figtree"}
.l{font:500 28px/1.2 "DM Mono";letter-spacing:.06em;text-transform:uppercase}
.pill{align-self:flex-start;font:500 28px/1 "DM Mono";letter-spacing:.08em;text-transform:uppercase;background:#121318;color:#F8F0E3;border-radius:999px;padding:12px 22px}
.tag{display:inline-block;white-space:nowrap;border:5px solid #121318;border-radius:999px;padding:10px 26px;font:700 34px/1.1 "Figtree";box-shadow:7px 7px 0 #121318;color:#121318}
.num{font:800 120px/1 "Rubik";font-variant-numeric:tabular-nums}
.row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:18px}
.list{margin:0;padding:0;list-style:none;display:grid;gap:18px}
.list li{display:grid;grid-template-columns:52px 1fr;gap:4px 14px;align-items:baseline}
.list .n{font:800 40px/1 "Rubik"}
.list b{font:800 42px/1.05 "Rubik"}
.list span:not(.n){grid-column:2;font:500 28px/1.2 "Figtree"}
.under{background:#FFFBF4;border:4px solid #121318;border-radius:12px;padding:8px 16px}
`;

const tagH = (id, text, fill, rot) => `<span id="${id}" class="tag ${fill}" style="rotate:${rot}deg">${text}</span>`;

/* ---------- the house (one SVG, every part addressable) ---------- */
const INK = "#121318", CREAM = "#FFFBF4";
const FILL = { C: "#03C0E8", O: "#40E0D0", D: "#D3D3FF", E: "#C4C4C4" };
function houseSVG() {
  let s = `<defs><pattern id="cement" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#F0E5D2"/><circle cx="2" cy="2" r="1" fill="#C4C4C4"/><circle cx="6" cy="6" r="0.8" fill="#C4C4C4"/></pattern></defs>`;
  // blueprint outline
  const dash = `fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="8 6"`;
  s += `<g id="outline"><rect x="14" y="244" width="292" height="40" rx="6" ${dash}/>${[0, 1, 2, 3].map((i) => `<rect x="${30 + i * 70}" y="128" width="50" height="110" rx="6" ${dash}/>`).join("")}<polygon points="14,120 160,32 306,120" ${dash} stroke-linejoin="round"/></g>`;
  // foundation
  s += `<g id="fnd"><rect x="19" y="249" width="292" height="40" rx="6" fill="${INK}"/><rect x="14" y="244" width="292" height="40" rx="6" fill="url(#cement)" stroke="${INK}" stroke-width="3.5"/><text x="160" y="269" text-anchor="middle" font-family="DM Mono" font-size="19" font-weight="500" letter-spacing="0.5" fill="${INK}">DOCUMENTATION + DATA</text></g>`;
  // pillars
  ["C", "O", "D", "E"].forEach((L, i) => {
    const x = 30 + i * 70;
    s += `<g id="p${L}"><g id="ps${L}"><rect x="${x + 5}" y="133" width="50" height="110" rx="6" fill="${INK}"/><rect x="${x}" y="128" width="50" height="110" rx="6" fill="${CREAM}" stroke="${INK}" stroke-width="3.5"/><rect id="pc${L}" x="${x}" y="128" width="50" height="110" rx="6" fill="${FILL[L]}" stroke="${INK}" stroke-width="3.5" opacity="0"/></g><text id="pl${L}" x="${x + 25}" y="196" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="38" fill="${INK}" opacity="0">${L}</text></g>`;
  });
  // roof
  s += `<g id="roof"><polygon points="19,125 165,37 311,125" fill="${INK}" opacity="0.35"/><polygon points="14,120 160,32 306,120" fill="${INK}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><text x="160" y="100" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="30" letter-spacing="1" fill="#F8F0E3">BRAND</text></g>`;
  return `<svg viewBox="0 0 320 300" width="480" height="450" style="overflow:visible">${s}</svg>`;
}

/* ---------- motion helpers (local time = remap(raw) - scene start) ---------- */
function scene(id, rawStart, rawEnd, markup) {
  const t0 = remap(rawStart), t1 = rawEnd === "END" ? TOTAL : remap(rawEnd);
  const tw = [];
  const L = (raw) => +(remap(raw) - t0).toFixed(3);
  const api = {
    id, t0, dur: +(t1 - t0).toFixed(3), markup, tw, L,
    set(sel, vars) { tw.unshift(`gsap.set(${JSON.stringify(sel)}, ${JSON.stringify(vars)});`); return api; },
    pop(sel, raw, opts = {}) {
      const { from = {}, dur = 0.5, ease = "expo.out", stagger = 0 } = opts;
      tw.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify({ opacity: 0, scale: 0.86, filter: "blur(8px)", ...from })}, ${JSON.stringify({ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)", duration: dur, ease, stagger })}, ${L(raw)});`);
      return api;
    },
    to(sel, raw, vars) { tw.push(`tl.to(${JSON.stringify(sel)}, ${JSON.stringify(vars)}, ${L(raw)});`); return api; },
    fromTo(sel, raw, a, b) { tw.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(a)}, ${JSON.stringify(b)}, ${L(raw)});`); return api; },
    out(sel, raw, opts = {}) {
      const at = raw === "END" ? Math.max(0, t1 - t0 - 0.32) : L(raw);
      tw.push(`tl.to(${JSON.stringify(sel)}, ${JSON.stringify({ opacity: 0, filter: "blur(6px)", duration: 0.28, ease: "power2.in", stagger: opts.stagger || 0 })}, ${at});`);
      return api;
    },
  };
  return api;
}

const S = [];
/* Lesson 1.2 scenes (raw times from Brittany's take; spliced into the 1.1 generator by make-gen12.py) */
const EXTRA_CSS = `
.list.tight{gap:8px}.list.tight li{grid-template-columns:44px 1fr;gap:0 10px}.list.tight b{font-size:36px}.list.tight span:not(.n){font-size:28px}.list.tight .n{font-size:34px}
.flow{display:flex;flex-direction:column;align-items:center;gap:6px}
.down{font:500 28px/1 "DM Mono";letter-spacing:.06em;text-transform:uppercase;background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:6px 14px}
.cube{display:grid;grid-template-columns:repeat(3,92px);gap:8px;padding:12px;background:#121318;border-radius:20px;box-shadow:10px 10px 0 rgba(18,19,24,.35)}
.cube span{height:92px;border-radius:10px}
`;
const sq = (fills) => fills.map((f, i) => `<span id="q${i}" class="${f}"></span>`).join("");

/* 01 Title */
{
  const s = scene("s01", 6.4, at("focus", 15.4) - 0.3, `<div class="zone">
    <div id="s01a" class="st cy" style="padding:36px 44px"><span class="pill">Lesson 1.2</span><div class="h big">Own Your 24</div><div class="l">Hands-On AI</div></div>
  </div>`);
  s.pop("#s01a", at("lesson", 8.6), { from: { y: -80, rotation: -4 }, dur: 0.7 }).out("#s01a", "END");
  S.push(s);
}
/* 02 Focus on one thing */
{
  const s = scene("s02", at("focus", 15.4) - 0.3, 24.45, `<div class="zone">
    <div id="s02a" class="st" style="rotate:-2deg"><div class="h big">Focus on<br>one thing.</div></div>
    ${tagH("s02t", "Your biggest constraint", "cy", 2)}
  </div>`);
  s.pop("#s02a", at("focus", 15.4)).pop("#s02t", at("biggest", 19.8), { from: { y: 40 } }).out("#s02a, #s02t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 03 Quote */
{
  const s = scene("s03", at("said", 36.6) - 0.4, 54.7, `<div class="zone">
    <div id="s03a" class="st" style="max-width:620px"><div class="l">Hormozi · Diary of a CEO</div><div class="h md" style="font-size:46px;line-height:1.1">“People only see the choices you made, not the options you had.”</div></div>
    <div id="s03b" class="st sm li" style="rotate:2deg;align-self:flex-end"><div class="b">You can't see focus.</div><div class="h md">You only see winning.</div></div>
  </div>`);
  s.pop("#s03a", at("people", 37.1)).pop("#s03b", at("witness", 43.2), { from: { y: 40 } }).out("#s03a, #s03b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 04 Constraint: the lagging pillar */
{
  const s = scene("s04", at("constraint", 68.0) - 0.4, at("Two", 91.1) - 0.3, `<div class="zone">
    <div id="hw4">${houseSVG().replace(/id="/g, 'id="y').replace("url(#cement)", "url(#ycement)")}</div>
    <div id="s04c" class="st" style="position:absolute;top:10px;right:-10px;max-width:330px;rotate:2deg"><div class="h md">What breaks first?</div><div class="b">2 leads a week becomes 20.</div></div>
  </div>`);
  s.set("#youtline", { opacity: 0 }).set("#ypcC, #ypcO, #ypcD, #ypcE, #yplC, #yplO, #yplD, #yplE", { opacity: 1 })
    .pop("#hw4", at("constraint", 68.0))
    .to("#ypsE, #yplE", at("laying", 69.5), { scaleY: 0.45, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.inOut" })
    .to("#yroof", at("laying", 69.5) + 0.3, { rotation: 13, svgOrigin: "14 120", duration: 0.6, ease: "back.out(1.6)" })
    .to("#hw4", at("break", 79.2) - 0.3, { x: -130, scale: 0.78, duration: 0.6, ease: "power2.inOut" }).pop("#s04c", at("break", 79.2), { from: { rotation: 8 } })
    .out("#hw4, #s04c", "END", { stagger: 0.04 });
  S.push(s);
}
/* 05 Demand or supply */
{
  const s = scene("s05", at("Two", 91.1) - 0.3, at("pendulum", 142.2) - 0.4, `<div class="zone">
    <div class="row" style="gap:28px;align-items:stretch">
      <div id="s05d" class="st sm cy" style="rotate:-2deg;max-width:300px"><div class="l">Demand</div><div class="b">Short on customers</div></div>
      <div id="s05s" class="st sm te" style="rotate:2deg;max-width:300px"><div class="l">Supply</div><div class="b">Short on time and crew</div></div>
    </div>
    ${tagH("s05m", "Most businesses: short on leads", "li", -2)}
  </div>`);
  s.pop("#s05d", at("Demand", 97.2), { from: { x: -40 } }).pop("#s05s", at("supply", 103.7), { from: { x: 40 } })
    .pop("#s05m", at("Most", 120.6), { from: { y: 40 } }).out("#s05d, #s05s, #s05m", "END", { stagger: 0.04 });
  S.push(s);
}
/* 06 Pendulum */
{
  const t0 = at("pendulum", 142.2), t1 = at("happy", 155.3);
  const s = scene("s06", t0 - 0.3, at("Rubik's", 168.1) - 0.4, `<div class="zone">
    <svg viewBox="0 0 300 230" width="520" height="400" style="overflow:visible"><circle cx="150" cy="12" r="9" fill="#121318"/><path d="M38 175 Q150 245 262 175" fill="none" stroke="#121318" stroke-width="3" stroke-dasharray="7 6"/>
      <g id="pend"><line x1="150" y1="12" x2="150" y2="180" stroke="#121318" stroke-width="6"/><circle cx="153" cy="185" r="28" fill="#121318"/><circle cx="150" cy="182" r="28" fill="#03C0E8" stroke="#121318" stroke-width="5"/></g></svg>
    <div class="row" style="justify-content:space-between;width:100%">${tagH("s06l", "Not enough leads", "cy", -3)}${tagH("s06r", "Can't keep up", "te", 3)}</div>
  </div>`);
  s.pop("#pend", t0, { from: { scale: 1 } }).pop("#s06l", t0 + 0.2, { from: { y: 30 } }).pop("#s06r", at("can't", 148.6), { from: { y: 30 } });
  s.tw.push(`tl.fromTo("#pend",{rotation:32,svgOrigin:"150 12"},{rotation:-32,svgOrigin:"150 12",duration:1.25,ease:"sine.inOut",repeat:${Math.max(1, Math.round((s.dur - (t0 - (t0 - 0.3))) / 1.25) - 2)},yoyo:true},${s.L(t0)});`);
  s.out("#pend, #s06l, #s06r", "END", { stagger: 0.03 });
  S.push(s);
}
/* 07 Rubik's Cube */
{
  const s = scene("s07", at("Rubik's", 168.1) - 0.4, 216.65, `<div class="zone">
    <div id="s07c" class="cube" style="rotate:-8deg">${sq(["cy", "te", "li", "gr", "cy", "te", "li", "gr", "cy"])}</div>
    <div class="row">${tagH("s07a", "Fix the price sheet", "te", -3)}${tagH("s07b", "Break the books", "li", 3)}</div>
    <div id="s07t" class="st sm" style="rotate:-2deg"><div class="b">That's what you traded your job for.</div></div>
  </div>`);
  s.pop("#s07c", at("Rubik's", 168.1), { from: { rotation: -40 } })
    .to("#s07c", at("fix", 170.2), { rotation: 82, duration: 0.6, ease: "back.out(1.6)" })
    .to("#q0, #q4, #q8", at("messed", 173.4), { backgroundColor: "#D3D3FF", duration: 0.2 })
    .to("#q2, #q6", at("messed", 173.4), { backgroundColor: "#03C0E8", duration: 0.2 })
    .pop("#s07a", at("price", 176.4), { from: { y: 30 } }).pop("#s07b", at("accounting", 185.9), { from: { y: 30 } })
    .out("#s07a, #s07b", at("traded", 215.6) - 1.5)
    .pop("#s07t", at("traded", 215.6) - 1.2, { from: { y: 30 } })
    .out("#s07c, #s07t", "END", { stagger: 0.03 });
  S.push(s);
}
/* 08 Common constraints + 09 the list (one scene) */
{
  const items = [["Not enough leads", "", 242.8, "not"], ["Poor conversion", "", 246.6, "poor"], ["Poorly defined customer", "", 256.5, "poorly"], ["Missing data", "", 273.2, "Data"],
    ["Wheels falling off the bus", "", 289.9, "wheels"], ["No profit", "pricier techs ate it", 321.2, "No"], ["Underpriced", "can't pay good techs", 346.2, "underpriced"], ["One and done", "", 362.4, "one"]];
  const s = scene("s08", at("common", 223.4) - 0.3, at("Not", 385.4) - 0.4, `<div class="zone">
    <div id="s08h" class="st gr" style="position:absolute;rotate:-2deg"><div class="h">Common<br>constraints</div><div class="l">Hormozi · The Game #894</div></div>
    <div id="s08l" class="st" style="position:relative;width:560px;padding:20px 26px">
      <ul class="list tight">${items.map(([b, sub], i) => `<li id="s08i${i}"><span class="n">${i + 1}</span><b>${b}</b>${sub ? `<span>${sub}</span>` : ""}</li>`).join("")}</ul>
      <svg id="s08arr" viewBox="0 0 40 400" width="40" height="400" preserveAspectRatio="none" style="position:absolute;left:-52px;top:28px;height:calc(100% - 56px);overflow:visible"><path d="M30 395 Q4 395 4 360 L4 30 Q4 6 24 6" fill="none" stroke="#121318" stroke-width="5" stroke-linecap="round"/><path d="M14 -4 L28 6 L14 16" fill="none" stroke="#121318" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>`);
  s.set(items.map((_, i) => `#s08i${i}`).join(","), { opacity: 0 }).set("#s08l", { opacity: 0 })
    .pop("#s08h", at("common", 223.4), { from: { y: -40 } })
    .out("#s08h", at("Number", 242.2) - 0.5)
    .to("#s08l", at("Number", 242.2) - 0.3, { opacity: 1, duration: 0.25 });
  items.forEach(([, , near, w], i) => s.pop(`#s08i${i}`, at(w, near), { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.fromTo("#s08arr", at("circle", 375.7) - 0.6, { opacity: 1, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power2.inOut" })
    .out("#s08l", "END");
  S.push(s);
}
/* 10 Not enough */
{
  const s = scene("s10", at("Not", 385.4) - 0.3, at("And", 393.9), `<div class="zone">
    <div style="display:flex;flex-direction:column;align-items:center;gap:22px">${tagH("s10a", "Not enough leads", "cy", -3)}${tagH("s10b", "Not enough money", "te", 2)}${tagH("s10c", "Not enough good people", "li", -2)}</div>
  </div>`);
  s.pop("#s10a", at("Not", 385.4), { from: { y: 30 } }).pop("#s10b", at("not", 386.4), { from: { y: 30 } }).pop("#s10c", at("not", 387.6), { from: { y: 30 } })
    .out("#s10a, #s10b, #s10c", "END", { stagger: 0.03 });
  S.push(s);
}
/* 11 It sucks to suck */
{
  const s = scene("s11", at("sucks", 396.2) - 0.3, at("not", 466.0) - 0.4, `<div class="zone">
    <div id="s11a" class="st li" style="rotate:-2deg"><div class="h big">It sucks<br>to suck.</div></div>
    <div class="row">${tagH("s11b", "Drop a customer type", "gr", -2)}${tagH("s11c", "Say no", "cy", 3)}${tagH("s11d", "$400 is now $700", "te", -3)}</div>
  </div>`);
  s.pop("#s11a", at("sucks", 396.2), { from: { y: -60 } })
    .pop("#s11b", at("drop", 417.1), { from: { y: 30 } }).pop("#s11c", at("no", 421.6), { from: { y: 30 } }).pop("#s11d", at("400", 430.9), { from: { y: 30 } })
    .out("#s11a, #s11b, #s11c, #s11d", "END", { stagger: 0.03 });
  S.push(s);
}
/* 12 Not deciding */
{
  const s = scene("s12", at("not", 466.0) - 0.4, 482.3, `<div class="zone">
    <div id="s12a" class="st gr"><div class="h">Not deciding<br>is a decision.</div><div class="l">It keeps you stuck in the suck</div></div>
  </div>`);
  s.pop("#s12a", at("not", 466.0)).out("#s12a", "END");
  S.push(s);
}
/* 13 The shiny new thing */
{
  const s = scene("s13", at("new", 503.1) - 0.5, at("fact", 525.5), `<div class="zone">
    <div class="row" style="max-width:600px">${tagH("s13a", "New location", "cy", -6)}${tagH("s13b", "New product", "te", 4)}${tagH("s13c", "Go commercial", "li", -3)}${tagH("s13d", "Just new stuff", "gr", 5)}</div>
    <div id="s13l" class="l under">Avoiding the thing that sucks</div>
  </div>`);
  s.pop("#s13a", at("location", 503.3), { from: { y: -60 } }).pop("#s13b", at("product", 504.8), { from: { y: -60 } })
    .pop("#s13c", at("commercial", 509.5), { from: { y: -60 } }).pop("#s13d", at("stuff", 523.7) - 0.4, { from: { y: -60 } })
    .pop("#s13l", at("stuff", 523.7));
  s.tw.push(`tl.to("#s13a, #s13b, #s13c, #s13d, #s13l",{x:700,rotation:20,opacity:0,duration:0.35,ease:"power3.in",stagger:0.03},${(s.dur - 0.45).toFixed(2)});`);
  S.push(s);
}
/* 14 More or better beats new */
{
  const s = scene("s14", at("fact", 525.5), at("Can", 582.2) - 0.6, `<div class="zone">
    <div id="s14a" class="st te"><div class="h">More or better<br>beats new.</div><div id="s14n" class="l">98 times out of 100</div></div>
    <div id="s14b" class="st sm" style="rotate:2deg"><div class="b">You don't solve a constraint.</div><div class="h md">You loosen it.</div></div>
  </div>`);
  s.pop("#s14a", at("more", 527.4), { from: { y: -60 } }).set("#s14n", { opacity: 0 }).pop("#s14n", at("98", 530.0), { from: { scale: 1 } })
    .pop("#s14b", at("relieve", 553.3), { from: { y: 40 } }).out("#s14a, #s14b", "END", { stagger: 0.03 });
  S.push(s);
}
/* 15 Can we do more of it? */
{
  const s = scene("s15", at("Can", 582.2) - 0.4, 632.2, `<div class="zone">
    <div class="flow">
      <div id="s15a" class="st sm"><div class="b"><b>Can we do more of it?</b></div></div>
      <span id="s15d1" class="down">&darr; no</span>
      <div id="s15b" class="st sm li"><div class="b"><b>Why not?</b> Make it better.</div></div>
      <span id="s15d2" class="down">&darr;</span>
      <div id="s15c" class="st sm te"><div class="b"><b>Then do more.</b></div></div>
      <span id="s15d3" class="down">&darr; maxed out</span>
      <div id="s15e" class="st sm gr"><div class="b">Only then: <b>something new</b></div></div>
    </div>
  </div>`);
  s.pop("#s15a", at("Can", 582.2)).pop("#s15d1, #s15b", at("Why", 587.1), { stagger: 0.12 })
    .pop("#s15d2, #s15c", at("more", 602.6), { stagger: 0.12 }).pop("#s15d3, #s15e", at("only", 628.5), { stagger: 0.12 })
    .out("#s15a, #s15d1, #s15b, #s15d2, #s15c, #s15d3, #s15e", "END", { stagger: 0.02 });
  S.push(s);
}
/* 16 Idea Bank */
{
  const s = scene("s16", at("ideas", 699.0) - 0.4, 726.8, `<div class="zone">
    <div class="row">${tagH("s16a", "New idea", "li", -5)}${tagH("s16b", "A suggestion", "te", 3)}${tagH("s16c", "Shiny thing", "cy", -2)}</div>
    <div id="s16x" style="background:#FFFBF4;border:5px solid #121318;border-top-width:22px;border-radius:0 0 28px 28px;box-shadow:10px 10px 0 #121318;padding:28px 56px;text-align:center;display:grid;gap:8px"><div class="h md">Idea Bank</div><div class="l">Deposit now. Withdraw later.</div></div>
  </div>`);
  s.pop("#s16a", at("ideas", 699.0), { from: { y: -40 } }).pop("#s16b", at("suggestions", 700.6), { from: { y: -40 } }).pop("#s16c", at("ideas", 703.5), { from: { y: -40 } })
    .pop("#s16x", at("idea", 706.1), { from: { y: 60 } });
  s.tw.push(`tl.to("#s16a, #s16b, #s16c",{y:150,scale:0.5,opacity:0,duration:0.45,ease:"power3.in",stagger:0.08},${s.L(at("deposit", 720.8))});`);
  s.out("#s16x", "END");
  S.push(s);
}
/* 17 Bad days */
{
  const s = scene("s17", at("bad", 734.4) - 0.6, at("Point", 788.8) - 0.3, `<div class="zone">
    <div id="s17a" class="st gr" style="rotate:-2deg"><div class="h">Some days are<br>bad days.</div></div>
    <div class="row">${tagH("s17b", "Grind through it", "cy", -3)}<span id="s17o" class="h md" style="background:#FFFBF4;border-radius:999px;padding:0 14px">or</span>${tagH("s17c", "Honor where you are", "li", 3)}</div>
  </div>`);
  s.pop("#s17a", at("bad", 734.4), { from: { y: -60 } }).pop("#s17b", at("grind", 777.3), { from: { x: -40 } })
    .pop("#s17o, #s17c", at("honor", 783.6), { from: { x: 40 }, stagger: 0.1 })
    .out("#s17a, #s17b, #s17o, #s17c", "END", { stagger: 0.03 });
  S.push(s);
}
/* 18 Fallback tasks */
{
  const items = [["Document a process", "documenting", 836.7], ["Work on your SOPs", "SOPs", 838.7], ["Log your ideas", "logging", 839.6], ["Clean out your inbox", "cleaning", 841.0], ["Unsubscribe from stuff", "unsubscribing", 843.4]];
  const s = scene("s18", at("Point", 788.8) - 0.3, at("those", 859.9) - 0.4, `<div class="zone">
    <div id="s18a" class="st" style="width:560px"><div class="l">Fallback tasks</div>
      <ul class="list tight" style="gap:10px">${items.map(([t], i) => `<li id="s18i${i}" style="grid-template-columns:30px 1fr"><span class="n" style="width:22px;height:22px;border-radius:99px;background:#40E0D0;border:4px solid #121318;align-self:center"></span><b>${t}</b></li>`).join("")}</ul></div>
  </div>`);
  s.set(items.map((_, i) => `#s18i${i}`).join(","), { opacity: 0 }).pop("#s18a", at("fallback", 790.0));
  items.forEach(([, w, near], i) => s.pop(`#s18i${i}`, at(w, near), { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.out("#s18a", "END");
  S.push(s);
}
/* 19 Recap */
{
  const s = scene("s19", at("those", 859.9) - 0.4, at("Very", 884.3) - 0.3, `<div class="zone">
    <div id="s19a" class="st" style="width:560px"><div class="l">Own your 24</div>
      <ul class="list tight"><li id="s19i0"><span class="n">1</span><b>One project at a time</b></li><li id="s19i1"><span class="n">2</span><b>Protect it</b><span>Idea Bank + fallback tasks</span></li><li id="s19i2"><span class="n">3</span><b>More or better beats new</b></li></ul></div>
  </div>`);
  s.set("#s19i0, #s19i1, #s19i2", { opacity: 0 }).pop("#s19a", at("big", 861.2))
    .pop("#s19i0", at("One", 863.2), { from: { scale: 1, x: -24 } }).pop("#s19i1", at("protect", 865.5), { from: { scale: 1, x: -24 } }).pop("#s19i2", at("more", 873.8), { from: { scale: 1, x: -24 } })
    .out("#s19a", "END");
  S.push(s);
}
/* 20 End card */
{
  const s = scene("s20", at("Very", 884.3) - 0.3, "END", `<div class="zone">
    <div id="s20a" class="st cy" style="padding:36px 44px;max-width:620px"><span class="pill">Your action</span><div class="h big" style="font-size:76px">Set up your first project</div><div class="b">The prompt is right below.</div><div id="s20ar" class="h big" style="align-self:center">&darr;</div></div>
    <div id="s20n" class="st sm" style="rotate:2deg;align-self:flex-end"><div class="l">Next</div><div class="b"><b>1.3 Job Site Prep</b></div></div>
  </div>`);
  s.pop("#s20a", at("Very", 884.3), { from: { y: -60 }, dur: 0.7 })
    .fromTo("#s20ar", at("Very", 884.3) + 1, { y: -16 }, { y: 12, duration: 0.5, ease: "power2.inOut", repeat: 3, yoyo: true })
    .pop("#s20n", at("new", 887.5), { from: { x: 60 } });
  S.push(s);
}

/* ---------- captions (burned in, bottom band; Brittany 2026-11-16) ---------- */
const inKeep = (t) => keep.some(([a, b]) => t >= a && t < b);
const FIX = { "ramosy": "Hormozi", "mosey": "Hormozi", "laying": "lagging", "ticks": "techs", "tax": "techs", "hig": "hired" };
const FIXAT = { "346.1": "you're", "9.3": "Own", "9.7": "Your", "30.2": "Diary", "232.3": "Game", "31.1": "CEO." };
const FILLER = /^(um|uh|uh\.\.\.|f)[,.]?$/i;
const cw = words
  .filter((w) => inKeep(w.start) && !FILLER.test(w.text.trim()))
  .map((w) => {
    let text = w.text.trim();
    const key = text.toLowerCase().replace(/[.,?!]+$/, "");
    if (FIX[key]) text = FIX[key] + text.slice(key.length);
    if (FIXAT[w.start.toFixed(1)]) text = FIXAT[w.start.toFixed(1)];
    if (text === "Do") text = "do";
    return { text, raw: w.start, s: remap(w.start), e: Math.min(remap(w.end), remap(w.start) + 1.2) };
  });
const groups = [];
let g = [];
for (let i = 0; i < cw.length; i++) {
  const w = cw[i], prev = cw[i - 1];
  const seam = prev && keep.findIndex(([x, y]) => prev.raw >= x && prev.raw < y) !== keep.findIndex(([x, y]) => w.raw >= x && w.raw < y);
  const brk = g.length && (seam || g.length >= 5 || /[.?!]$/.test(prev.text) || w.s - prev.e >= 0.15 && g.length >= 3 || w.s - prev.e > 0.6);
  if (brk) { groups.push(g); g = []; }
  g.push(w);
}
if (g.length) groups.push(g);
const capTw = [];
const capHtml = groups.map((grp, gi) => {
  const start = Math.max(0.15, grp[0].s - 0.05);
  const next = groups[gi + 1];
  const end = Math.min(next ? next[0].s - 0.02 : TOTAL - 0.05, grp[grp.length - 1].e + 0.5);
  capTw.push(`tl.set("#cg${gi}",{visibility:"visible"},${start.toFixed(3)});tl.fromTo("#cg${gi}",{opacity:0},{opacity:1,duration:0.1,ease:"power2.out"},${start.toFixed(3)});tl.to("#cg${gi}",{opacity:0,duration:0.1,ease:"power2.in"},${Math.max(start + 0.11, end - 0.1).toFixed(3)});tl.set("#cg${gi}",{visibility:"hidden"},${Math.max(start + 0.22, end).toFixed(3)});`);
  grp.forEach((w, wi) => {
    const ws = Math.max(start, w.s), we = wi < grp.length - 1 ? grp[wi + 1].s : end - 0.1;
    capTw.push(`tl.set("#cw${gi}_${wi}",{backgroundColor:"#40E0D0"},${ws.toFixed(3)});tl.set("#cw${gi}_${wi}",{backgroundColor:"rgba(64,224,208,0)"},${Math.max(ws + 0.05, we).toFixed(3)});`);
  });
  return `<div id="cg${gi}" class="cg"><span class="pill">${grp.map((w, wi) => `<span id="cw${gi}_${wi}" class="cw">${w.text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join(" ")}</span></div>`;
}).join("\n    ");
fs.mkdirSync(dir + "hf/compositions", { recursive: true });
fs.writeFileSync(`${dir}hf/compositions/cap.html`, `<template>
  <style>
    @font-face{font-family:"Figtree";src:url('assets/fonts/figtree.woff2') format('woff2');font-weight:300 900}
    #root{position:absolute;inset:0;background:transparent}
    .cg{position:absolute;left:0;right:0;bottom:84px;text-align:center;opacity:0;visibility:hidden;overflow:visible}
    .cg .pill{display:inline-block;max-width:1500px;background:#FFFBF4;color:#121318;border:4px solid #121318;border-radius:22px;box-shadow:6px 6px 0 #121318;padding:10px 24px 12px;font:700 50px/1.2 "Figtree";letter-spacing:-.005em}
    .cw{border-radius:10px;padding:0 4px;margin:0 -4px;background:rgba(64,224,208,0)}
  </style>
  <div id="root" data-composition-id="cap" data-width="1920" data-height="1080" data-layout-allow-caption-zone>
    ${capHtml}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${capTw.join("\n    ")}
    window.__timelines["cap"] = tl;
  </script>
</template>
`);
console.log("captions:", groups.length, "groups,", cw.length, "words");

/* ---------- write files ---------- */
fs.mkdirSync(dir + "hf/compositions", { recursive: true });
for (const s of S) {
  fs.writeFileSync(`${dir}hf/compositions/${s.id}.html`, `<template>
  <style>${CSS}${EXTRA_CSS}</style>
  <div id="root" data-composition-id="${s.id}" data-width="1920" data-height="1080" data-layout-allow-overlap>
    ${s.markup}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${s.tw.join("\n    ")}
    window.__timelines["${s.id}"] = tl;
  </script>
</template>
`);
}
const hosts = S.map((s, i) => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.t0.toFixed(3)}" data-duration="${s.dur.toFixed(3)}" data-track-index="${i + 1}" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:${i + 2}"></div>`).join("\n");
fs.writeFileSync(dir + "hf/index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #121318; }
      #root { width: 100%; height: 100%; position: relative; }
      #talk { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; object-fit: contain; z-index: 1; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-width="1920" data-height="1080">
      <video id="talk" class="clip" src="assets/tight.mp4" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="0" playsinline data-has-audio="true"></video>
${hosts}
      <div id="cap" data-composition-id="cap" data-composition-src="compositions/cap.html" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="${S.length + 1}" data-track-kind="captions" data-width="1920" data-height="1080" style="z-index:${S.length + 5}"></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`);
console.log("total", TOTAL.toFixed(2), "s;", S.map((s) => `${s.id}@${s.t0.toFixed(1)}+${s.dur.toFixed(1)}`).join(" "));
