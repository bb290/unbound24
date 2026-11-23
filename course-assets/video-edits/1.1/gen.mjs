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

/* 01 Cold open: no blueprint (0:01 raw) */
{
  const s = scene("s01", 2.6, at("Right", 22.5) + 0.6, `<div class="zone">
    <div id="s01a" class="st" style="rotate:-2deg"><div class="l">The plan</div><div class="h">No blueprint.</div><div id="s01v" class="h">Just vibes.</div></div>
    <div id="s01b" class="st sm li" style="rotate:2deg;align-self:flex-end;margin-right:20px"><div class="l">Hardware store trips today</div><div id="s01n" class="num">1</div></div>
  </div>`);
  s.pop("#s01a", at("blueprint", 3)).pop("#s01v", at("wing", 7.5), { from: { scale: 1 } })
    .pop("#s01b", at("Home", 13.5), { from: { y: 40 } });
  // the counter ticks 1 to 14 while she talks about running around
  const a = s.L(at("Home", 13.5)) + 0.3, b = s.L(at("crazy", 19));
  s.tw.push(`{const o={n:1};tl.to(o,{n:14,duration:${(b - a).toFixed(2)},ease:"power1.in",onUpdate(){document.querySelector("#s01n").textContent=Math.round(o.n)}},${a.toFixed(2)});}`);
  s.out("#s01a, #s01b", "END", { stagger: 0.05 });
  S.push(s);
}

/* 02 Patchwork */
{
  const tags = [["YouTube video", "cy", -6], ["Instagram reel", "te", 4], ["Another reel", "li", -3], ["A guy's podcast", "gr", 6], ["Your cousin's advice", "cy", -2]];
  const s = scene("s02", at("YouTube", 35) - 0.3, at("Not", 40.3), `<div class="zone">
    <div class="row" style="max-width:600px">${tags.map(([t, f, r], i) => tagH(`s02t${i}`, t, f, r)).join("")}</div>
    <div id="s02l" class="l under">Your current plan</div>
  </div>`);
  s.pop("#s02t0", at("YouTube", 35), { from: { y: -60 } }).pop("#s02t1", at("Instagram", 36.5), { from: { y: -60 } })
    .pop("#s02t2, #s02t3, #s02t4", at("patchwork", 38.5) - 0.4, { from: { y: -60 }, stagger: 0.12 })
    .pop("#s02l", at("patchwork", 38.5) + 0.3);
  s.tw.push(`tl.to("#s02t0, #s02t1, #s02t2, #s02t3, #s02t4, #s02l", {x:700, rotation:20, opacity:0, duration:0.35, ease:"power3.in", stagger:0.03}, ${(s.dur - 0.45).toFixed(2)});`);
  S.push(s);
}

/* 03 Title */
{
  const s = scene("s03", at("Not", 40.3), at("This", 50.9), `<div class="zone">
    <div id="s03a" class="st cy" style="padding:36px 44px"><span class="pill">Lesson 1.1</span><div class="h big">Business<br>Breakdown</div><div class="l">Hands-On AI</div></div>
  </div>`);
  s.pop("#s03a", at("Not", 40.3) + 0.1, { from: { y: -80, rotation: -4 }, dur: 0.7 }).out("#s03a", "END");
  S.push(s);
}

/* 04 Three goals */
{
  const s = scene("s04", at("service", 53.5), at("Alright", 96.5), `<div class="zone">
    <div id="s04a" class="st" style="width:600px"><div class="l">What we're building</div>
      <ul class="list">
        <li id="s04i1"><span class="n">1</span><b>Qualified leads</b><span>ready to pay market rate</span></li>
        <li id="s04i2"><span class="n">2</span><b>Five-star work</b><span>reviews, repeat jobs, referrals</span></li>
        <li id="s04i3"><span class="n">3</span><b id="s04h">A good job for everyone</b><span>including you, the owner</span></li>
      </ul></div>
    <span id="s04s" class="tag li" style="rotate:-5deg;align-self:flex-end">The part everybody skips</span>
  </div>`);
  s.set("#s04i1, #s04i2, #s04i3", { opacity: 0 })
    .pop("#s04a", at("service", 53.5)).pop("#s04i1", at("One", 57.5), { from: { scale: 1, x: -20 } })
    .pop("#s04i2", at("Two", 67), { from: { scale: 1, x: -20 } }).pop("#s04i3", at("three", 73.5), { from: { scale: 1, x: -20 } })
    .pop("#s04s", at("skips", 77), { from: { rotation: -15 } })
    .fromTo("#s04h", at("owner", 90), { backgroundColor: "rgba(211,211,255,0)" }, { backgroundColor: "rgba(211,211,255,1)", duration: 0.4 })
    .out("#s04a, #s04s", "END", { stagger: 0.05 });
  S.push(s);
}

/* 05 The house: blueprint, foundation, CODE pillars, roof (1:37 to 6:28 raw) */
{
  const s = scene("s05", at("house", 99.5) - 0.2, 388.0, `<div class="zone">
    <div id="hw" style="position:relative">${houseSVG()}</div>
    <div id="s05code" class="l under" style="position:absolute;bottom:20px">Built to code</div>
    <div id="s05fc" class="st" style="position:absolute;top:0;right:-6px;max-width:380px;rotate:-2deg"><div class="h md">Foundation</div><div class="b">Every process written down. Numbers you track.</div></div>
    ${[["C", "Capture", "Get their attention. Bring in leads.", "cy"], ["O", "Obtain", "Leads into paying customers.", "te"], ["D", "Deliver", "Great work. Same way every time.", "li"]].map(([k, h, b, f]) => `<div id="s05c${k}" class="st ${f}" style="position:absolute;top:-10px;right:-6px;max-width:370px;rotate:2deg"><div class="h md">${h}</div><div class="b">${b}</div>${k === "O" ? '<div id="s05aka" class="l">aka your sales process</div>' : ""}</div>`).join("")}
    <div id="s05r" style="position:absolute;right:0;top:40px;display:flex;flex-direction:column;align-items:flex-end;gap:18px">
      <div id="s05rh" class="st sm gr"><div class="l">E is for Extend</div><div class="h md">The four Rs</div></div>
      ${tagH("s05r1", "Refine", "gr", -3)}${tagH("s05r2", "Review", "cy", 2)}
      <div id="s05rn" class="l under" style="margin-top:-6px">Ask every customer</div>
      ${tagH("s05r3", "Refer", "te", -2)}${tagH("s05r4", "Repeat", "li", 3)}
    </div>
    <div id="s05v" class="row" style="position:absolute;bottom:0">${tagH("s05v1", "Visual", "cy", -3)}${tagH("s05v2", "Voice", "te", 2)}${tagH("s05v3", "Values", "li", -2)}</div>
    <div id="s05full" class="l under" style="position:absolute;bottom:20px">Foundation. Pillars. Roof.</div>
  </div>`);
  const P = ["C", "O", "D", "E"];
  s.set("#fnd, #roof, #s05code, #s05fc, #s05cC, #s05cO, #s05cD, #s05r, #s05v, #s05full", { opacity: 0 })
    .set(P.map((k) => `#p${k}`).join(","), { opacity: 0 })
    // blueprint
    .fromTo("#outline", at("house", 99.5), { opacity: 0, scale: 0.94, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" })
    .pop("#s05code", at("code", 105.5))
    // foundation pours left to right
    .out("#s05code", at("foundation", 108.2))
    .fromTo("#fnd", at("foundation", 108.2), { opacity: 1, clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power2.inOut" })
    .pop("#s05fc", at("documentation", 114), { from: { rotation: -8 } })
    .out("#s05fc", at("pillars", 141) - 0.4)
    // pillars rise, blank
    .to("#outline", at("pillars", 141), { opacity: 0, duration: 0.5 })
    .fromTo(P.map((k) => `#p${k}`).join(","), at("pillars", 141), { opacity: 1, scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.7, ease: "expo.out", stagger: 0.1 });
  // C O D E stamp on as she says each letter
  [["C", 168.7], ["O", 169.1], ["D", 169.5], ["E", 169.9]].forEach(([k, near]) => {
    const t = at(k, near);
    s.to(`#pc${k}`, t, { opacity: 1, duration: 0.15 })
      .fromTo(`#pl${k}`, t, { opacity: 0, scale: 1.8, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
  });
  // highlight each pillar with its callout
  const dim = (keepK, t) => P.forEach((k) => s.to(`#p${k}`, t, { opacity: k === keepK ? 1 : 0.32, duration: 0.3 }));
  const tC = at("capture", 176.7), tO = at("obtain", 187.3), tD = at("deliver", 212.5), tE = at("extend", 226.5);
  dim("C", tC); s.pop("#s05cC", tC, { from: { rotation: 8 } }).out("#s05cC", tO - 0.35);
  dim("O", tO); s.pop("#s05cO", tO, { from: { rotation: 8 } }).set("#s05aka", { opacity: 0 }).pop("#s05aka", at("sales", 194.5), { from: { scale: 1 } }).out("#s05cO", tD - 0.35);
  dim("D", tD); s.pop("#s05cD", tD, { from: { rotation: 8 } }).out("#s05cD", tE - 0.35);
  // E: house slides left and shrinks; the four Rs stack on the right
  dim("E", tE);
  s.to("#hw", tE + 0.3, { x: -200, scale: 0.62, duration: 0.7, ease: "power2.inOut" })
    .set("#s05rh, #s05r1, #s05r2, #s05rn, #s05r3, #s05r4", { opacity: 0 }).to("#s05r", tE + 0.3, { opacity: 1, duration: 0.01 })
    .pop("#s05rh", at("R's", 238.6), { from: { x: 40 } })
    .pop("#s05r1", at("refine", 245.5), { from: { x: 60 } })
    .pop("#s05r2", at("review", 247.44), { from: { x: 60 } }).pop("#s05rn", at("review", 247.44) + 0.5, { from: { scale: 1 } })
    .pop("#s05r3", at("referral", 256.2), { from: { x: 60 } })
    .pop("#s05r4", at("repeat", 261.5), { from: { x: 60 } });
  // roof: back to centre, every pillar on, roof lands
  const tR = at("roof", 344.65);
  s.out("#s05r", 343.85).to("#hw", 343.85, { x: 0, scale: 1, duration: 0.7, ease: "power2.inOut" });
  P.forEach((k) => s.to(`#p${k}`, 343.85, { opacity: 1, duration: 0.4 }));
  s.fromTo("#roof", tR, { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" })
    .set("#s05v1, #s05v2, #s05v3", { opacity: 0 }).to("#s05v", tR, { opacity: 1, duration: 0.01 })
    .pop("#s05v1", at("visual", 372), { from: { y: 30 } }).pop("#s05v2", at("voice", 373), { from: { y: 30 } }).pop("#s05v3", at("values", 374), { from: { y: 30 } })
    .out("#s05v", at("But", 381.8))
    .pop("#s05full", at("Foundation", 384.5))
    .out("#hw, #s05full", "END");
  S.push(s);
}

/* 06 A thousand things to do */
{
  const notes = [["Great service", "li", -6, "deliver", 414.3], ["Reviews", "te", 4, "reviews", 415.8], ["Website", "cy", -2, "website", 417.5], ["Books", "gr", 7, "books", 419], ["Accounting", "li", -5, "accounting", 420.5], ["Invoices", "te", 3, "invoices", 422.5], ["Price sheet", "cy", -7, "price", 424], ["Shingle colors", "gr", 5, "shingles", 427.5]];
  const extra = [["Socials", "li", -3], ["Emails", "te", 6], ["Hiring", "cy", -4], ["TikTok?", "gr", 4]];
  const all = [...notes, ...extra];
  const s = scene("s06", at("deliver", 414.3) - 0.3, at("instead", 443.6) - 0.2, `<div class="zone">
    <div id="s06g" style="display:grid;grid-template-columns:repeat(4,146px);gap:14px">${all.map(([t, f, r], i) => `<div id="s06n${i}" class="${f}" style="height:140px;display:grid;place-items:center;text-align:center;border:5px solid #121318;box-shadow:7px 7px 0 #121318;font:700 ${t.length > 9 ? 22 : 30}px/1.1 Figtree;letter-spacing:${t.length > 9 ? "-.02em" : "0"};padding:4px;rotate:${r}deg">${t}</div>`).join("")}</div>
  </div>`);
  notes.forEach(([, , , w, near], i) => {
    let t; try { t = at(w, near); } catch { t = near; }
    s.pop(`#s06n${i}`, t, { from: { y: -50, rotation: 12 }, dur: 0.35 });
  });
  s.pop(extra.map((_, i) => `#s06n${notes.length + i}`).join(","), at("millions", 431), { from: { y: -50, rotation: -12 }, dur: 0.3, stagger: 0.12 });
  // the pile shakes on "urgency"
  s.tw.push(`tl.fromTo("#s06g",{x:0},{x:8,duration:0.06,repeat:7,yoyo:true,ease:"none"},${s.L(at("urgency", 436.5))});`);
  // everything drops off the wall on "slow down"
  s.tw.push(`tl.to(${JSON.stringify(all.map((_, i) => `#s06n${i}`).join(","))},{y:760,rotation:25,duration:0.5,ease:"power3.in",stagger:0.025},${(s.dur - 0.75).toFixed(2)});`);
  S.push(s);
}

/* 07 Slow down. Hot tub, no walls. */
{
  const s = scene("s07", at("instead", 443.6) - 0.2, at("Not", 490.8), `<div class="zone">
    <div id="s07a" class="st te" style="rotate:-2deg"><div class="h big">Slow down.<br>Focus.</div></div>
    <div class="row" style="flex-direction:column;gap:10px">${tagH("s07t1", "Built-out TikTok", "gr", -4)}<span id="s07eq" class="h md">=</span>${tagH("s07t2", "Hot tub, no walls", "li", 3)}</div>
    <div id="s07c" class="l under">Structure first. Amenities later.</div>
  </div>`);
  s.pop("#s07a", at("slow", 444.3), { from: { y: -60 } })
    .pop("#s07t1", at("TikTok", 459), { from: { x: -40 } })
    .pop("#s07eq, #s07t2", at("hot", 465.5), { from: { x: 40 }, stagger: 0.08 })
    .pop("#s07c", at("amenities", 476))
    .out("#s07a, #s07t1, #s07eq, #s07t2, #s07c", "END", { stagger: 0.03 });
  S.push(s);
}

/* 08 Idea Bank */
{
  const s = scene("s08", at("ideas", 492.5) - 0.3, 515.7, `<div class="zone">
    <div class="row" id="s08r">${tagH("s08t1", "Hot tub", "li", -5)}${tagH("s08t2", "Pergola", "te", 3)}${tagH("s08t3", "Fire pit", "cy", -2)}</div>
    <div id="s08b" style="background:#FFFBF4;border:5px solid #121318;border-top-width:22px;border-radius:0 0 28px 28px;box-shadow:10px 10px 0 #121318;padding:28px 56px;text-align:center;display:grid;gap:8px"><div class="h md">Idea Bank</div><div class="l">Lesson 1.2</div></div>
  </div>`);
  s.pop("#s08t1", at("tub", 497), { from: { y: -40 } }).pop("#s08t2", at("pergola", 499), { from: { y: -40 } }).pop("#s08t3", at("fire", 500.5), { from: { y: -40 } })
    .pop("#s08b", at("save", 503.5), { from: { y: 60 } });
  s.tw.push(`tl.to("#s08t1, #s08t2, #s08t3",{y:150,scale:0.5,opacity:0,duration:0.45,ease:"power3.in",stagger:0.08},${s.L(at("later", 510.3))});`);
  s.out("#s08b", "END");
  S.push(s);
}

/* 09 Brick by brick */
{
  const N = 25;
  const t0 = at("brick", 537), t1 = at("thing", 581.5);
  const s = scene("s09", at("build", 525.5), at("thing", 581.5) + 1.2, `<div class="zone">
    <div id="s09h" class="st sm" style="rotate:-2deg"><div class="h md">One brick at a time.</div></div>
    <div id="s09w" style="display:grid;grid-template-columns:repeat(5,110px);gap:10px;transform:scaleY(-1)">${Array.from({ length: N }, (_, i) => `<span id="s09b${i}" style="height:44px;border:4px dashed rgba(18,19,24,.35);border-radius:8px;position:relative"><i id="s09f${i}" style="position:absolute;inset:-4px;border:4px solid #121318;border-radius:8px;background:#C4C4C4;opacity:0"></i></span>`).join("")}</div>
  </div>`);
  s.pop("#s09w", at("build", 525.5), { from: { scale: 1 } }).pop("#s09h", t0, { from: { y: -40 } });
  const step = (t1 - t0) / N;
  for (let i = 0; i < N; i++) {
    const t = t0 + i * step;
    s.fromTo(`#s09f${i}`, t, { opacity: 0, y: 60, backgroundColor: "#03C0E8" }, { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" })
      .to(`#s09f${i}`, t + step, { backgroundColor: "#C4C4C4", duration: 0.2 });
  }
  s.out("#s09h, #s09w", "END");
  S.push(s);
}

/* 10 Right order, in balance (the lopsided house) */
{
  const tTilt = at("this", 609.5), tBal = at("balance", 613.4);
  const s = scene("s10", at("right", 587.2) - 0.3, at("Alright", 621.4), `<div class="zone">
    <div id="hw2">${houseSVG().replace(/id="/g, 'id="z').replace('url(#cement)', 'url(#zcement)')}</div>
    <div class="row" style="position:absolute;bottom:0">${tagH("s10t1", "Right order", "te", -2)}${tagH("s10t2", "In balance", "cy", 2)}</div>
  </div>`);
  s.set("#zoutline", { opacity: 0 }).set("#zpcC, #zpcO, #zpcD, #zpcE, #zplC, #zplO, #zplD, #zplE", { opacity: 1 })
    .pop("#hw2", at("right", 587.2)).pop("#s10t1", at("order", 587.5) + 0.2, { from: { y: 30 } })
    // E pillar comes up short, then the roof tips (her hand does the same)
    .to("#zpsE, #zplE", at("fourth", 607), { scaleY: 0.45, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.inOut" })
    .to("#zroof", tTilt, { rotation: 13, svgOrigin: "14 120", duration: 0.6, ease: "back.out(1.6)" })
    // level it out
    .to("#zpsE, #zplE", tBal, { scaleY: 1, duration: 0.6, ease: "power2.out" })
    .to("#zroof", tBal, { rotation: 0, svgOrigin: "14 120", duration: 0.6, ease: "power2.out" })
    .pop("#s10t2", tBal + 0.4, { from: { y: 30 } })
    .out("#hw2, #s10t1, #s10t2", "END", { stagger: 0.03 });
  S.push(s);
}

/* 11 AI is a power tool */
{
  const s = scene("s11", at("hand", 634.3) - 0.3, 679.2, `<div class="zone">
    <div class="row" style="gap:28px">
      <div id="s11a" class="st sm gr" style="rotate:-2deg"><div class="l">Hand tools</div><div class="b">Hand saw every board</div></div>
      <div id="s11b" class="st sm cy" style="rotate:2deg"><div class="l">Power tools</div><div class="h md">AI</div></div>
    </div>
    <div id="s11c" class="st" style="max-width:600px"><div class="b">A drill doesn't install the cabinet.</div><div class="h md">You do. Just faster.</div></div>
  </div>`);
  s.pop("#s11a", at("hand", 634.3), { from: { x: -40 } })
    .pop("#s11b", at("power", 659.5), { from: { x: 40 } })
    .pop("#s11c", at("cabinet", 670.5), { from: { y: 40 } })
    .out("#s11a, #s11b, #s11c", "END", { stagger: 0.04 });
  S.push(s);
}

/* 12 How this course works */
{
  const s = scene("s12", 689.65, at("right", 716.5) - 0.4, `<div class="zone">
    <div id="s12a" class="st" style="width:600px"><div class="l">How this course works</div>
      <ul class="list">
        <li id="s12i1"><span class="n">1</span><b>Your business is a house</b></li>
        <li id="s12i2"><span class="n">2</span><b>AI is a power tool</b></li>
        <li id="s12i3"><span class="n">3</span><b>Hands-on</b><span>the way you learned your trade</span></li>
      </ul></div>
  </div>`);
  s.set("#s12i1, #s12i2, #s12i3", { opacity: 0 })
    .pop("#s12a", 689.7).pop("#s12i1", at("one", 693.1), { from: { scale: 1, x: -20 } })
    .pop("#s12i2", at("Two", 697.5), { from: { scale: 1, x: -20 } }).pop("#s12i3", at("three", 702.5), { from: { scale: 1, x: -20 } })
    .out("#s12a", "END");
  S.push(s);
}

/* 13 End card */
{
  const s = scene("s13", at("right", 716.5) - 0.2, "END", `<div class="zone">
    <div id="s13a" class="st cy" style="padding:36px 44px;max-width:620px"><span class="pill">Your action</span><div class="h big">Set up your Claude</div><div class="b">The prompt is right below.</div><div id="s13ar" class="h big" style="align-self:center">&darr;</div></div>
    <div id="s13n" class="st sm" style="rotate:2deg;align-self:flex-end"><div class="l">Next</div><div class="b"><b>1.2 Own Your 24</b></div></div>
  </div>`);
  s.pop("#s13a", at("right", 716.5), { from: { y: -60 }, dur: 0.7 })
    .fromTo("#s13ar", at("prompt", 717.5), { y: -16 }, { y: 12, duration: 0.5, ease: "power2.inOut", repeat: 3, yoyo: true })
    .pop("#s13n", at("business", 721.5), { from: { x: 60 } });
  S.push(s);
}

/* ---------- captions (burned in, bottom band; Brittany 2026-11-16) ---------- */
const inKeep = (t) => keep.some(([a, b]) => t >= a && t < b);
const FIX = { "hands-awed": "hands-on", "office": "this", "van": "vanity" };
const FILLER = /^(um|uh|uh\.\.\.|f)[,.]?$/i;
const cw = words
  .filter((w) => inKeep(w.start) && !FILLER.test(w.text.trim()))
  .map((w) => {
    let text = w.text.trim();
    const key = text.toLowerCase().replace(/[.,?!]+$/, "");
    if (FIX[key]) text = FIX[key] + text.slice(key.length);
    if (/^code[.,]?$/i.test(text) && w.start > 160 && w.start < 170) text = text.replace(/code/i, "CODE");
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
  <style>${CSS}</style>
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
