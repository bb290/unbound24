// Generates the HyperFrames project (hf/): index.html + one overlay scene per beat.
// Cue times are written as raw times in Brittany's Vids take (word lookups in transcript.json) and remapped
// onto the tightened cut (keep.json), so a change to the cut list re-times every graphic.
import fs from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const words = JSON.parse(fs.readFileSync(dir + "transcript.json", "utf8"));
const keep = JSON.parse(fs.readFileSync(dir + "keep.json", "utf8")).keep;
const PAD = 4; // end-card hold added after the last frame
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
/* Lesson 1.3 Job Site Prep: scenes on the Nov 3 take + the Nov 4 voiceover redo (times are in the tightened cut, which is the published cut).
   Camera parts use the wall zone; the voiceover section (413.05 to 763.95, no camera) uses the full frame on cream. */
const EXTRA_CSS = `
.list.tight{gap:8px}.list.tight li{grid-template-columns:44px 1fr;gap:0 10px}.list.tight b{font-size:36px}.list.tight span:not(.n){font-size:28px}.list.tight .n{font-size:34px}
.flow{display:flex;flex-direction:column;align-items:center;gap:6px}
.down{font:500 28px/1 "DM Mono";letter-spacing:.06em;text-transform:uppercase;background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:6px 14px}
.math{display:flex;align-items:baseline;gap:14px;font:800 64px/1 "Rubik";letter-spacing:-.02em}
.full{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#F8F0E3}
.stage{position:absolute;left:110px;top:60px;width:1700px;height:660px;display:flex;align-items:center;justify-content:center;gap:44px;color:#121318}
.col{display:flex;flex-direction:column;align-items:center;gap:22px}
.shot{position:relative;border:5px solid #121318;border-radius:22px;box-shadow:12px 12px 0 #121318;overflow:hidden;background:#fff;flex:none}
.shot video,.shot img{display:block;position:absolute;left:0;top:0}
.code{background:#121318;color:#F8F0E3;font:500 22px/1.4 "DM Mono";border-radius:22px;padding:22px 26px;white-space:pre;box-shadow:12px 12px 0 #40E0D0;flex:none}
.h.xl{font-size:132px}
.big-word{font:800 150px/1 "Rubik";letter-spacing:-.03em}
.circle{width:330px;height:330px;border-radius:50%;border:6px solid #121318;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;box-shadow:10px 10px 0 #121318;padding:30px}
.dash{width:46px;height:6px;background:#121318;border-radius:4px;flex:none}
.tbl{display:grid;gap:10px;width:640px}
.tbl div{display:flex;justify-content:space-between;align-items:center;background:#FFFBF4;border:4px solid #121318;border-radius:14px;padding:12px 20px;font:700 32px/1.1 "Figtree"}
.tbl span{font:500 30px/1 "DM Mono"}
.chk{font:700 40px/1.3 "Figtree"}
`;
const cut = (sel) => sel; // readability
const shot = (id, src, { w, h, vw, x = 0, y = 0, start, dur, ms = 0, rot = 0 }) =>
  `<div id="${id}" class="shot" style="width:${w}px;height:${h}px;rotate:${rot}deg"><video id="${id}v" class="clip" src="assets/screens/${src}.mp4" data-start="${start.toFixed(3)}" data-duration="${dur.toFixed(3)}" data-media-start="${ms}" data-track-index="1" muted playsinline style="width:${vw}px;left:${-x}px;top:${-y}px"></video></div>`;
const chapter = (id, num, title, sub) => `<div class="full"><div class="stage"><div id="${id}" class="st li" style="padding:44px 56px;align-items:center;text-align:center;rotate:-1.5deg">${num ? `<span class="pill" style="align-self:center">${num}</span>` : ""}<div class="h xl" style="font-size:104px">${title}</div>${sub ? `<div class="l">${sub}</div>` : ""}</div></div></div>`;

/* ===================== Camera part 1 ===================== */
/* 01 Title */
{
  const s = scene("s01", 0, at("first", 16.32) - 0.4, `<div class="zone">
    <div id="s01a" class="st cy" style="padding:36px 44px"><span class="pill">Lesson 1.3</span><div class="h big">Job Site Prep</div><div class="l">Hands-On AI</div></div>
    ${tagH("s01t", "AI essentials", "li", 3)}
  </div>`);
  s.pop("#s01a", at("called", 2.07), { from: { y: -80, rotation: -4 }, dur: 0.7 }).pop("#s01t", at("essential", 4.56), { from: { y: 40 } })
    .out("#s01a, #s01t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 02 Topic 1: Context */
{
  const s = scene("s02", at("first", 16.32) - 0.4, at("imagine", 23.0) - 0.3, `<div class="zone">
    <div id="s02a" class="st te" style="rotate:-2deg"><span class="pill">AI essentials · 1</span><div class="h big">Context</div></div>
  </div>`);
  s.pop("#s02a", at("context", 18.04) - 0.2, { from: { y: -60 } }).out("#s02a", "END");
  S.push(s);
}
/* 03 The stranger */
{
  const s = scene("s03", at("imagine", 23.0) - 0.3, at("now", 43.24) - 0.4, `<div class="zone">
    <div id="s03a" class="st" style="max-width:600px"><div class="l">A stranger asks</div><div class="h md" style="font-size:46px;line-height:1.1">“Can you send the invoices for the work I did yesterday?”</div></div>
    ${tagH("s03t", "No context", "gr", -3)}
  </div>`);
  s.pop("#s03a", at("invoices", 30.43) - 1.2).pop("#s03t", at("lacking", 36.73), { from: { y: 40 } }).out("#s03a, #s03t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 04 With context */
{
  const items = [["Services", "services", 53.84], ["Price sheet", "price", 55.25], ["Calendar", "calendar", 59.99], ["Email", "email", 60.98], ["Brand guide", "brand", 73.2]];
  const s = scene("s04", at("now", 43.24) - 0.4, at("okay", 83.52) - 0.3, `<div class="zone">
    <div id="s04a" class="st" style="width:520px"><div class="l">Here's my whole business</div>
      <ul class="list tight" style="gap:10px">${items.map(([t], i) => `<li id="s04i${i}" style="grid-template-columns:30px 1fr"><span class="n" style="width:22px;height:22px;border-radius:99px;background:#40E0D0;border:4px solid #121318;align-self:center"></span><b>${t}</b></li>`).join("")}</ul></div>
    ${tagH("s04t", "Enough context = invoice sent", "cy", -2)}
  </div>`);
  s.set(items.map((_, i) => `#s04i${i}`).join(","), { opacity: 0 }).pop("#s04a", at("now", 43.24) + 6.5);
  items.forEach(([, w, near], i) => s.pop(`#s04i${i}`, at(w, near), { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.pop("#s04t", at("enough", 78.05), { from: { y: 40 } }).out("#s04a, #s04t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 05 Give AI enough context */
{
  const s = scene("s05", at("okay", 83.52) - 0.3, at("last", 93.9) - 0.4, `<div class="zone">
    <div id="s05a" class="st li" style="rotate:-2deg"><div class="h">Give AI<br>enough context</div></div>
    <div class="row">${tagH("s05b", "Who we are", "cy", -3)}${tagH("s05c", "What we do", "te", 2)}${tagH("s05d", "What we charge", "gr", -2)}</div>
  </div>`);
  s.pop("#s05a", at("enough", 85.13) - 0.3, { from: { y: -60 } }).pop("#s05b", at("who", 86.41), { from: { y: 30 } })
    .pop("#s05c", at("what", 87.11), { from: { y: 30 } }).pop("#s05d", at("what", 88.56), { from: { y: 30 } })
    .out("#s05a, #s05b, #s05c, #s05d", "END", { stagger: 0.03 });
  S.push(s);
}
/* 06 Your project = context */
{
  const s = scene("s06", at("last", 93.9) - 0.4, at("two", 141.53) - 1.4, `<div class="zone">
    <div id="s06a" class="st te" style="rotate:-2deg"><div class="l">Your project</div><div class="h big">= context</div><div class="b">Claude starts with it, every time.</div></div>
    <div id="s06b" class="st sm gr" style="rotate:2deg;align-self:flex-end;margin-right:20px"><div class="l">No project</div><div class="b"><b>A stranger on the street</b></div></div>
  </div>`);
  s.pop("#s06a", at("instructions", 103.08) - 0.6, { from: { y: -60 } }).pop("#s06b", at("stranger", 128.75) - 0.4, { from: { y: 40 } })
    .out("#s06a, #s06b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 07 Topic 2 */
{
  const s = scene("s07", at("two", 141.53) - 1.4, at("deterministic", 161.14) - 0.6, `<div class="zone">
    <div id="s07a" class="st cy" style="rotate:-2deg"><span class="pill">AI essentials · 2</span><div class="h">Deterministic<br>vs. probabilistic</div><div class="l">What AI actually is</div></div>
  </div>`);
  s.pop("#s07a", at("two", 141.53) - 0.2, { from: { y: -60 } }).out("#s07a", "END");
  S.push(s);
}
/* 08 Deterministic */
{
  const s = scene("s08", at("deterministic", 161.14) - 0.6, at("material", 184.32) - 1.6, `<div class="zone">
    <div id="s08a" class="st" style="rotate:-2deg"><div class="h md">Deterministic</div><div class="b">A formula. Same answer every time.</div></div>
    <div id="s08b" class="st te" style="rotate:2deg;align-items:center"><div class="math" style="font-size:96px">3 + 5 = 8</div><div class="l">Every time</div></div>
  </div>`);
  s.pop("#s08a", at("formula", 164.95) - 0.5, { from: { y: -60 } }).pop("#s08b", at("three", 169.68) - 0.2, { from: { y: 40 } })
    .out("#s08a, #s08b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 09 Job cost */
{
  const s = scene("s09", at("material", 184.32) - 1.6, at("probabilistic", 225.13) - 1.6, `<div class="zone">
    <div id="s09a" class="st" style="rotate:-2deg"><div class="l">In a trades business</div><div class="h md">Material + labor + overhead = job cost</div></div>
    <div class="row">${tagH("s09b", "Calculator", "cy", -3)}${tagH("s09c", "Spreadsheet", "te", 3)}</div>
  </div>`);
  s.pop("#s09a", at("material", 184.32) - 0.3, { from: { y: -60 } }).pop("#s09b", at("calculator", 208.06), { from: { y: 30 } })
    .pop("#s09c", at("spreadsheet", 209.05), { from: { y: 30 } }).out("#s09a, #s09b, #s09c", "END", { stagger: 0.04 });
  S.push(s);
}
/* 10 Probabilistic */
{
  const s = scene("s10", at("probabilistic", 225.13) - 1.6, at("twice", 259.59) - 2.4, `<div class="zone">
    <div id="s10a" class="st li" style="rotate:-2deg"><div class="h md">Probabilistic</div><div class="b">A prediction. AI's best guess.</div></div>
    <div class="row" style="gap:22px;align-items:stretch">
      <div id="s10b" class="st sm" style="rotate:-2deg;align-items:center"><div class="l">Formula</div><div class="math" style="font-size:52px">3 + 5 = 8</div><div class="l">every time</div></div>
      <div id="s10c" class="st sm cy" style="rotate:2deg;align-items:center"><div class="l">AI</div><div class="math" style="font-size:52px">best guess</div><div class="l">different each time</div></div>
    </div>
  </div>`);
  s.pop("#s10a", at("probabilistic", 225.13) - 0.3, { from: { y: -60 } }).pop("#s10b", at("three", 240.74) - 0.3, { from: { x: -40 } })
    .pop("#s10c", at("finish", 243.72), { from: { x: 40 } }).out("#s10a, #s10b, #s10c", "END", { stagger: 0.04 });
  S.push(s);
}
/* 11 More context, better guess */
{
  const s = scene("s11", at("twice", 259.59) - 2.4, at("okay", 292.67) + 0.3, `<div class="zone">
    <div id="s11a" class="st" style="rotate:-2deg"><div class="h md">Same question,<br>different answer</div></div>
    <div id="s11b" class="st te" style="rotate:2deg"><div class="h md">More context =<br>a better guess</div></div>
    <div id="s11c" class="st sm li" style="rotate:-1deg"><div class="b"><b>Variation isn't a defect.</b> It's the whole point.</div></div>
  </div>`);
  s.pop("#s11a", at("twice", 259.59) - 1.4, { from: { y: -40 } }).pop("#s11b", at("more", 272.88), { from: { y: 40 } })
    .pop("#s11c", at("variation", 279.37), { from: { y: 40 } }).out("#s11a, #s11b, #s11c", "END", { stagger: 0.04 });
  S.push(s);
}
/* 12 Can it be creatively wrong? */
{
  const s = scene("s12", at("okay", 292.67) + 0.3, at("deterministic", 331.0) - 0.4, `<div class="zone">
    <div id="s12a" class="st" style="rotate:-2deg"><div class="l">Which one?</div><div class="h md">Is it okay to be<br>creatively wrong?</div></div>
    <div class="row" style="gap:20px;align-items:stretch">
      <div id="s12b" class="st sm gr" style="rotate:-2deg;max-width:300px"><div class="l">Estimate</div><div class="b"><b>Never wrong</b></div></div>
      <div id="s12c" class="st sm cy" style="rotate:2deg;max-width:300px"><div class="l">Email</div><div class="b"><b>Different is fine</b></div></div>
    </div>
    ${tagH("s12d", "Best: both + a human check", "te", -2)}
  </div>`);
  s.pop("#s12a", at("wrong", 303.13) - 1.5, { from: { y: -60 } }).pop("#s12b", at("estimate", 307.58), { from: { x: -40 } })
    .pop("#s12c", at("email", 313.75), { from: { x: 40 } }).pop("#s12d", at("human", 327.77) - 0.2, { from: { y: 30 } })
    .out("#s12a, #s12b, #s12c, #s12d", "END", { stagger: 0.03 });
  S.push(s);
}
/* 13 If this, then that */
{
  const rules = [["30-year roof", "5-year warranty", "30year", 340.74], ["50-year roof", "10-year warranty", "50year", 348.46], ["Repair", "no warranty", "repair", 356.84]];
  const s = scene("s13", at("deterministic", 331.0) - 0.4, at("now", 372.82) - 0.3, `<div class="zone">
    <div id="s13a" class="st te" style="rotate:-2deg"><div class="l">Deterministic first</div><div class="h md">If this, then that</div></div>
    <div id="s13l" class="tbl" style="width:580px">${rules.map(([a, b], i) => `<div id="s13r${i}"><b style="font-weight:800">${a}</b><span>&rarr; ${b}</span></div>`).join("")}</div>
  </div>`);
  s.set(rules.map((_, i) => `#s13r${i}`).join(","), { opacity: 0 }).pop("#s13a", at("first", 331.94) - 0.5, { from: { y: -60 } });
  rules.forEach(([, , w, near], i) => s.pop(`#s13r${i}`, at(w, near), { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.out("#s13a, #s13l", "END", { stagger: 0.04 });
  S.push(s);
}
/* 14 AI reads the rules, a human sends */
{
  const s = scene("s14", at("now", 372.82) - 0.3, 413.05, `<div class="zone">
    <div class="flow">
      <div id="s14a" class="st sm"><div class="b"><b>The rules</b> (if this, then that)</div></div>
      <span id="s14d1" class="down">&darr;</span>
      <div id="s14b" class="st sm cy"><div class="b"><b>AI drafts the email</b></div></div>
      <span id="s14d2" class="down">&darr;</span>
      <div id="s14c" class="st sm te"><div class="b"><b>You check it and send</b></div></div>
    </div>
    ${tagH("s14t", "+ a little human razzle dazzle", "li", -3)}
  </div>`);
  s.pop("#s14a", at("deterministic", 374.19), { from: { y: -40 } }).pop("#s14d1, #s14b", at("draft", 382.73), { stagger: 0.12 })
    .pop("#s14d2, #s14c", at("human", 401.53), { stagger: 0.12 }).pop("#s14t", at("razzle", 409.47), { from: { y: 30 } })
    .out("#s14a, #s14d1, #s14b, #s14d2, #s14c, #s14t", "END", { stagger: 0.02 });
  S.push(s);
}

/* ===================== Voiceover section (full frame) ===================== */
/* 15 Topic 3 */
{
  const s = scene("v01", 413.05, at("parse", 425.19) - 1.0, chapter("v01a", "AI essentials · 3", "What can AI<br>actually read?", ""));
  s.pop("#v01a", 413.25, { from: { y: -60 }, dur: 0.6 }).out("#v01a", "END");
  S.push(s);
}
/* 16 Parse */
{
  const s = scene("v02", at("parse", 425.19) - 1.0, at("structured", 442.71) - 1.6, `<div class="full"><div class="stage">
    <div id="v02a" class="st cy" style="padding:40px 56px;rotate:-2deg"><div class="big-word">parse</div><div class="b">Break it down. Pick out what you need.</div></div>
    <div class="col">${tagH("v02b", "Like reading a blueprint", "te", 3)}${tagH("v02c", "Like reading an estimate", "li", -2)}</div>
  </div></div>`);
  s.pop("#v02a", at("parse", 425.19) - 0.2, { from: { y: -60 } }).pop("#v02b", at("blueprint", 431.54) - 0.3, { from: { x: 40 } })
    .pop("#v02c", at("estimate", 432.98) - 0.2, { from: { x: 40 } }).out("#v02a, #v02b, #v02c", "END", { stagger: 0.04 });
  S.push(s);
}
/* 17 Structured: the spreadsheet */
{
  const t0 = at("structured", 442.71) - 1.6, t1 = at("email", 464.6) - 4.6;
  const sp = at("spreadsheet", 447.43) - 0.4;
  const s = scene("v03", t0, t1, `<div class="full"><div class="stage" style="flex-direction:column;gap:26px">
    <div class="row" style="gap:28px">${tagH("v03s", "Structured: a place for everything", "te", -2)}${tagH("v03u", "Unstructured: buried in a paragraph", "gr", 2)}</div>
    ${shot("v03v", "spreadsheet", { w: 1480, h: 360, vw: 1700, x: 0, y: 220, start: sp - t0, dur: t1 - sp, ms: 0 })}
    <div class="row" style="gap:18px">${tagH("v03c1", "A · Customer", "cy", -2)}${tagH("v03c2", "B · Address", "li", 2)}${tagH("v03c3", "C · Total", "te", -2)}</div>
  </div></div>`);
  s.pop("#v03s", at("structured", 442.71) - 0.2, { from: { y: -30 } }).pop("#v03u", at("structured", 442.71) + 1.1, { from: { y: -30 } })
    .pop("#v03v", sp, { from: { y: 40, scale: 0.94 } })
    .pop("#v03c1", at("a", 450.72), { from: { y: 30 } }).pop("#v03c2", at("b", 452.46), { from: { y: 30 } }).pop("#v03c3", at("c", 454.08), { from: { y: 30 } })
    .out("#v03s, #v03u, #v03v, #v03c1, #v03c2, #v03c3", "END", { stagger: 0.02 });
  S.push(s);
}
/* 18 Unstructured: the email */
{
  const t0 = at("email", 464.6) - 4.6, t1 = at("spreadsheet", 486.92) - 1.4;
  const s = scene("v04", t0, t1, `<div class="full"><div class="stage">
    ${shot("v04v", "email", { w: 780, h: 600, vw: 780, start: 0.2, dur: t1 - t0 - 0.2, ms: 0, rot: -1 })}
    <div class="col" style="align-items:flex-start;max-width:640px">
      <div id="v04a" class="st"><div class="l">Unstructured</div><div class="h md">Same info.<br>Buried in a paragraph.</div></div>
      ${tagH("v04b", "Digging = parsing", "cy", -2)}
      ${tagH("v04c", "Where mistakes happen", "gr", 2)}
    </div>
  </div></div>`);
  s.pop("#v04v", t0 + 0.2, { from: { y: 40 } }).pop("#v04a", at("email", 464.6) - 0.2, { from: { x: 40 } })
    .pop("#v04b", at("digging", 477.85), { from: { x: 40 } }).pop("#v04c", at("wrong", 481.64), { from: { x: 40 } })
    .out("#v04v, #v04a, #v04b, #v04c", "END", { stagger: 0.03 });
  S.push(s);
}
/* 19 Easy to find + the rule of thumb */
{
  const t0 = at("spreadsheet", 486.92) - 1.4, t1 = at("now", 504.06) - 0.3, b = at("basically", 495.54);
  const s = scene("v05", t0, t1, `<div class="full"><div class="stage">
    <div id="v05w" class="col">
      ${shot("v05v", "spreadsheet", { w: 1480, h: 360, vw: 1700, x: 0, y: 220, start: 0, dur: b - t0, ms: 21 })}
      ${tagH("v05t", "In a spreadsheet: easy to find", "te", -2)}
    </div>
    <div id="v05a" class="st te" style="position:absolute;left:300px;top:150px;rotate:-2deg;padding:30px 40px"><div class="l">Structured</div><div class="chk">&check; Tables<br>&check; Bullet points</div></div>
    <div id="v05b" class="st gr" style="position:absolute;right:300px;top:190px;rotate:2deg;padding:30px 40px"><div class="l">Unstructured</div><div class="chk">&cross; Paragraphs</div></div>
  </div></div>`);
  s.pop("#v05v", t0 + 0.1, { from: { y: 40 } }).pop("#v05t", at("spreadsheet", 486.92) + 1.2, { from: { y: 30 } })
    .out("#v05w", b - 0.4)
    .pop("#v05a", b, { from: { y: -40 } }).pop("#v05b", at("paragraphs", 500.8) - 0.3, { from: { y: -40 } })
    .out("#v05a, #v05b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 20 How humans read vs how AI reads */
{
  const s = scene("v06", at("now", 504.06) - 0.3, at("pdf", 524.37) - 0.6, `<div class="full"><div class="stage" style="flex-direction:column">
    <div id="v06a" class="st" style="padding:30px 46px"><div class="h" style="font-size:76px">How humans read<br>vs. how AI reads</div></div>
    <div class="row" style="gap:22px">${tagH("v06b", "Invoices", "cy", -3)}${tagH("v06c", "Estimates", "te", 2)}${tagH("v06d", "Receipts", "li", -2)}</div>
  </div></div>`);
  s.pop("#v06a", at("humans", 505.74) - 0.3, { from: { y: -60 } }).pop("#v06b", at("invoices", 514.95), { from: { y: 30 } })
    .pop("#v06c", at("estimates", 516.16), { from: { y: 30 } }).pop("#v06d", at("receipts", 517.2), { from: { y: 30 } })
    .out("#v06a, #v06b, #v06c, #v06d", "END", { stagger: 0.03 });
  S.push(s);
}
/* 21 The PDF */
{
  const t0 = at("pdf", 524.37) - 0.6, t1 = at("guessing", 552.06) - 1.6;
  const raw = `Item Qty Unit price Amount
16' x 7' insulated steel carriage door, R-12.9, white,
windowed top
1 $1,895.00 $1,895.00
3/4 HP belt-drive smart opener, 2 remotes +
keypad
1 $549.00 $549.00
Torsion springs, 20,000-cycle (pair) 1 $210.00
Installation labor (hours) 6 $95.00 $570.00
Sales tax, 7% on materials ($3,004.00) $210.28`;
  const s = scene("v07", t0, t1, `<div class="full"><div class="stage">
    <div class="col">
      ${tagH("v07f", "estimate.pdf", "cy", -2)}
      ${shot("v07v", "pdf", { w: 640, h: 500, vw: 640, start: 1.0, dur: t1 - t0 - 1.0, ms: 0, rot: -1.5 })}
      ${tagH("v07h", "Made for printing. Looks great to us.", "te", 2)}
    </div>
    <div class="col" style="align-items:flex-start">
      <div id="v07c" class="col" style="align-items:flex-start;gap:14px"><span class="l" style="background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:6px 14px">What AI gets</span><div class="code" style="font-size:23px">${raw}</div></div>
      ${tagH("v07s", "Scan or photo: no text, just pixels", "gr", -2)}
    </div>
  </div></div>`);
  s.pop("#v07f", at("pdf", 524.37) - 0.3, { from: { y: -30 } }).pop("#v07v", at("printing", 526.2) - 0.8, { from: { y: 40 } })
    .pop("#v07h", at("humans", 528.8), { from: { y: 30 } }).pop("#v07c", at("bits", 532.25) - 0.4, { from: { x: 40 } })
    .pop("#v07s", at("scan", 541.48), { from: { y: 30 } })
    .out("#v07f, #v07v, #v07h, #v07c, #v07s", "END", { stagger: 0.02 });
  S.push(s);
}
/* 22 AI guessing which number goes with which line */
{
  const rows = [["Torsion springs (pair)", "$210.00"], ["Installation labor", "$570.00"], ["Old door removal", "$125.00"], ["Sales tax, 7%", "$210.28"]];
  const s = scene("v08", at("guessing", 552.06) - 1.6, at("markdown", 571.76) - 1.4, `<div class="full"><div class="stage">
    <div class="col">
      <div class="l" id="v08h" style="background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:8px 18px">AI guessing which number goes with which line</div>
      <div class="tbl" id="v08t">${rows.map(([a, b], i) => `<div id="v08r${i}"><span style="font:700 32px/1.1 Figtree">${a}</span><span style="position:relative"><span id="v08n${i}">${b}</span>${i === 1 ? '<span id="v08m1" style="position:absolute;right:0;top:0;opacity:0;background:#03C0E8;border-radius:8px;padding:0 6px;margin-right:-6px">$210.28</span>' : ""}</span></div>`).join("")}</div>
    </div>
    ${tagH("v08x", "Tax &ne; labor!", "cy", 5)}
  </div></div>`);
  s.set("#v08r0, #v08r1, #v08r2, #v08r3", { opacity: 0 }).pop("#v08h", at("guessing", 552.06) - 1.0, { from: { y: -30 } })
    .pop("#v08r0, #v08r1, #v08r2, #v08r3", at("guessing", 552.06), { from: { scale: 1, x: -24 }, stagger: 0.25, dur: 0.4 })
    .to("#v08r1", at("tax", 560.8), { backgroundColor: "#D3D3FF", duration: 0.2 })
    .to("#v08n1", at("tax", 560.8), { opacity: 0, duration: 0.15 })
    .to("#v08n3", at("tax", 560.8), { opacity: 0.25, duration: 0.2 })
    .to("#v08m1", at("tax", 560.8) + 0.1, { opacity: 1, duration: 0.2 })
    .pop("#v08x", at("tax", 560.8) + 0.5, { from: { rotation: -10 } })
    .out("#v08h, #v08t, #v08x", "END", { stagger: 0.03 });
  S.push(s);
}
/* 23 Markdown */
{
  const t0 = at("markdown", 571.76) - 1.4, t1 = at("md", 591.64) - 0.6;
  const s = scene("v09", t0, t1, `<div class="full"><div class="stage">
    ${shot("v09v", "markdown", { w: 820, h: 600, vw: 1200, x: 120, y: 90, start: 0.3, dur: t1 - t0 - 0.3, ms: 31, rot: -1 })}
    <div class="col" style="align-items:flex-start">
      <div id="v09a" class="st cy"><div class="h md">Markdown</div><div class="b">Plain text + a few marks</div></div>
      ${tagH("v09b", "# = heading", "te", -2)}
      ${tagH("v09c", "- = bullet", "li", 2)}
      ${tagH("v09d", "Humans read it. AI parses it.", "gr", -1)}
    </div>
  </div></div>`);
  s.pop("#v09v", t0 + 0.3, { from: { y: 40 } }).pop("#v09a", at("markdown", 571.76) - 0.2, { from: { x: 40 } })
    .pop("#v09b", at("pound", 578.69), { from: { x: 40 } }).pop("#v09c", at("dash", 581.0), { from: { x: 40 } })
    .pop("#v09d", at("humans", 583.51), { from: { x: 40 } })
    .out("#v09v, #v09a, #v09b, #v09c, #v09d", "END", { stagger: 0.02 });
  S.push(s);
}
/* 24 .MD = Markdown, not medical doctor; easy for both */
{
  const t0 = at("md", 591.64) - 0.6, t1 = at("markdown", 619.54) - 0.8, c = at("conveniently", 609.28);
  const md = `## Pricing

| Item               | Qty | Amount    |
|--------------------|----:|----------:|
| Steel garage door  |   1 | $1,895.00 |
| Smart opener       |   1 |   $549.00 |
| Installation labor |   6 |   $570.00 |
| Sales tax, 7%      |     |   $210.28 |
| **Total**          |     | **$3,909.28** |`;
  const s = scene("v10", t0, t1, `<div class="full"><div class="stage">
    <div id="v10w" class="col">
      <div id="v10a" style="background:#121318;color:#40E0D0;border-radius:30px;padding:24px 56px;box-shadow:12px 12px 0 #03C0E8;font:800 170px/1 'DM Mono'">.MD</div>
      <div id="v10b" class="st sm"><div class="b"><b>MD = Markdown.</b> Not medical doctor.</div></div>
    </div>
    <div id="v10c" class="col" style="position:absolute;opacity:0">
      <div class="code" style="font-size:26px;background:#FFFBF4;color:#121318;border:5px solid #121318;box-shadow:12px 12px 0 #121318">${md}</div>
      <div class="row">${tagH("v10d", "Easy for AI", "cy", -2)}${tagH("v10e", "Easy for you", "te", 2)}</div>
    </div>
  </div></div>`);
  s.pop("#v10a", at("md", 591.64) - 0.2, { from: { scale: 0.6 } }).pop("#v10b", at("medical", 601.02) - 0.4, { from: { y: 30 } })
    .out("#v10w", at("plain", 604.94) - 0.3)
    .to("#v10c", at("plain", 604.94), { opacity: 1, duration: 0.3 })
    .pop("#v10d", at("ai", 607.72), { from: { y: 30 } }).pop("#v10e", c, { from: { y: 30 } })
    .out("#v10c", "END");
  S.push(s);
}
/* 25 The common language */
{
  const nodes = [["People", "cy"], [".md", "dark"], ["Websites", "te"], ["AI", "li"]];
  const s = scene("v11", at("markdown", 619.54) - 0.8, at("tip", 634.56) - 1.0, `<div class="full"><div class="stage" style="flex-direction:column;gap:40px">
    <div id="v11h" class="l" style="background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:8px 18px">The common language</div>
    <div class="row" style="gap:16px;flex-wrap:nowrap">${nodes.map(([t, f], i) => `${i ? `<span id="v11l${i}" class="dash"></span>` : ""}<span id="v11n${i}" class="tag ${f === "dark" ? "" : f}" style="${f === "dark" ? "background:#121318;color:#40E0D0;font-family:'DM Mono'" : ""};rotate:${i % 2 ? 2 : -2}deg">${t}</span>`).join("")}</div>
    <div id="v11a" class="st te" style="rotate:-1deg"><div class="b"><b>You don't have to write it.</b> Claude writes it for you.</div></div>
    ${tagH("v11b", "Handing AI information? Markdown wins.", "li", 2)}
  </div></div>`);
  s.pop("#v11h", at("common", 620.52) - 0.4, { from: { y: -30 } })
    .pop("#v11n0, #v11l1, #v11n1, #v11l2, #v11n2, #v11l3, #v11n3", at("common", 620.52), { from: { y: 30 }, stagger: 0.18 })
    .pop("#v11a", at("write", 624.66) - 0.3, { from: { y: 30 } }).pop("#v11b", at("hand", 629.91) - 0.2, { from: { y: 30 } })
    .out("#v11h, #v11n0, #v11l1, #v11n1, #v11l2, #v11n2, #v11l3, #v11n3, #v11a, #v11b", "END", { stagger: 0.01 });
  S.push(s);
}
/* 26 Quick tip: PDF to Markdown */
{
  const s = scene("v12", at("tip", 634.56) - 1.0, at("custom", 652.08) - 2.2, `<div class="full"><div class="stage" style="flex-direction:column;gap:40px">
    ${tagH("v12q", "Quick tip", "cy", -3)}
    <div class="row" style="gap:20px;flex-wrap:nowrap">
      <span id="v12a" class="tag" style="background:#FFFBF4;font-family:'DM Mono'">estimate.pdf</span><span id="v12l1" class="dash"></span>
      <span id="v12b" class="tag" style="background:#121318;color:#F8F0E3">Claude</span><span id="v12l2" class="dash"></span>
      <span id="v12c" class="tag te" style="font-family:'DM Mono'">estimate.md</span>
    </div>
    <div id="v12d" class="st sm li" style="rotate:-2deg"><div class="h md">Double-check the numbers!</div></div>
  </div></div>`);
  s.pop("#v12q", at("tip", 634.56) - 0.3, { from: { y: -30 } }).pop("#v12a", at("pdf", 636.13), { from: { x: -30 } })
    .pop("#v12l1, #v12b", at("convert", 639.16), { from: { x: -30 }, stagger: 0.12 })
    .pop("#v12l2, #v12c", at("markdown", 640.41), { from: { x: -30 }, stagger: 0.12 })
    .pop("#v12d", at("double", 645.06), { from: { rotation: 8 } })
    .out("#v12q, #v12a, #v12l1, #v12b, #v12l2, #v12c, #v12d", "END", { stagger: 0.01 });
  S.push(s);
}
/* 27 Custom fields */
{
  const t0 = at("custom", 652.08) - 2.2, t1 = at("instead", 694.53) - 0.4, v0 = at("house", 656.64) - 0.4;
  const s = scene("v13", t0, t1, `<div class="full">
    <div id="v13w">${chapter("v13a", "", "Custom fields", "Same idea, in the software you already use")}</div>
    <div class="stage" id="v13s" style="opacity:0">
      ${shot("v13v", "customfields", { w: 1100, h: 580, vw: 1100, start: v0 - t0, dur: t1 - v0, ms: 0, rot: -1 })}
      <div class="col" style="align-items:flex-start">
        ${tagH("v13b", "Housecall Pro · Jobber · JobNimbus", "cy", -2)}
        ${tagH("v13c", "Just be aware. No homework yet.", "gr", 2)}
        <div id="v13d" class="st li" style="rotate:-2deg"><div class="h md">A labeled box</div></div>
        ${tagH("v13e", "Shingle color", "te", 3)}
      </div>
    </div>
  </div>`);
  s.pop("#v13a", t0 + 0.2, { from: { y: -60 } }).out("#v13w", v0 - 0.3)
    .to("#v13s", v0, { opacity: 1, duration: 0.3 }).pop("#v13v", v0, { from: { y: 40 } })
    .pop("#v13b", at("house", 656.64), { from: { x: 40 } })
    .pop("#v13c", at("aware", 673.63) - 1.5, { from: { x: 40 } })
    .pop("#v13d", at("labeled", 677.04) - 0.3, { from: { rotation: 8 } })
    .pop("#v13e", at("shingle", 693.04) - 0.3, { from: { y: 30 } })
    .out("#v13s", "END");
  S.push(s);
}
/* 28 Notes vs boxes */
{
  const s = scene("v14", at("instead", 694.53) - 0.4, at("notion", 727.32) - 1.2, `<div class="full"><div class="stage" style="flex-direction:column;gap:40px">
    <div class="row" style="gap:30px;flex-wrap:nowrap;align-items:center">
      <div id="v14a" class="st gr" style="rotate:-2deg;border-style:dashed;max-width:440px"><div class="l">Notes</div><div class="b"><b>“30-year shingle, came from a referral”</b></div><div class="l">= unstructured</div></div>
      <div id="v14ar" class="h big">&rarr;</div>
      <div class="col" style="gap:14px">
        <div id="v14b" class="st sm te" style="width:380px"><div class="l">Roof type</div><div class="b"><b>30-year shingle</b></div></div>
        <div id="v14c" class="st sm cy" style="width:380px"><div class="l">Lead source</div><div class="b"><b>Referral</b></div></div>
      </div>
    </div>
    <div id="v14d" class="st sm li" style="rotate:-1deg"><div class="b"><b>Later, AI reads the boxes.</b> Not a laundry list of notes.</div></div>
  </div></div>`);
  s.pop("#v14a", at("instead", 694.53), { from: { x: -40 } }).pop("#v14ar", at("own", 701.97) - 0.6, { from: { x: -20 } })
    .pop("#v14b", at("own", 701.97) - 0.3, { from: { x: 30 } }).pop("#v14c", at("own", 701.97), { from: { x: 30 } })
    .pop("#v14d", at("connect", 712.37), { from: { y: 30 } })
    .out("#v14a, #v14ar, #v14b, #v14c, #v14d", "END", { stagger: 0.02 });
  S.push(s);
}
/* 29 Notion */
{
  const t0 = at("notion", 727.32) - 1.2, t1 = at("both", 742.43) - 0.3, v0 = at("workspace", 729.95) - 0.5;
  const s = scene("v15", t0, t1, `<div class="full">
    <div id="v15w">${chapter("v15a", "AI essentials · 4", "Notion", "Where we'll work")}</div>
    <div class="stage" id="v15s" style="opacity:0">
      ${shot("v15v", "notion", { w: 1000, h: 590, vw: 1000, start: v0 - t0, dur: t1 - v0, ms: 0, rot: -1 })}
      <div class="col" style="align-items:flex-start">
        ${tagH("v15b", "An online workspace", "cy", -2)}
        ${tagH("v15c", "Like Google Docs, more organized", "li", 2)}
        ${tagH("v15d", "Your SOPs · projects · decisions", "te", -2)}
        ${tagH("v15e", "Free to start", "gr", 3)}
      </div>
    </div>
  </div>`);
  s.pop("#v15a", t0 + 0.2, { from: { y: -60 } }).out("#v15w", v0 - 0.3)
    .to("#v15s", v0, { opacity: 1, duration: 0.3 }).pop("#v15v", v0, { from: { y: 40 } })
    .pop("#v15b", at("workspace", 729.95), { from: { x: 40 } }).pop("#v15c", at("google", 731.75), { from: { x: 40 } })
    .pop("#v15d", at("sops", 735.63), { from: { x: 40 } }).pop("#v15e", at("free", 740.47), { from: { x: 40 } })
    .out("#v15s", "END");
  S.push(s);
}
/* 30 Built for both of us */
{
  const s = scene("v16", at("both", 742.43) - 0.3, 763.95, `<div class="full"><div class="stage" style="flex-direction:column;gap:30px">
    <div id="v16h" class="st sm" style="rotate:-1deg"><div class="h md">Built for both of us</div></div>
    <div class="row" style="gap:70px">
      <div id="v16a" class="circle" style="background:#40E0D0"><div class="l">Humans</div><div class="b"><b>Clean pages and tables</b></div></div>
      <div id="v16b" class="circle" style="background:#121318;color:#F8F0E3"><div class="l" style="color:#40E0D0">AI</div><div style="font:500 30px/1.4 'DM Mono'"># Markdown<br>- structured</div></div>
    </div>
  </div></div>`);
  s.pop("#v16h", at("both", 742.43) - 0.3, { from: { y: -40 } }).pop("#v16a", at("humans", 744.33), { from: { scale: 0.6 } })
    .pop("#v16b", at("underneath", 747.53), { from: { scale: 0.6 } })
    .to("#v16a", at("humans", 756.91), { rotation: -6, duration: 0.3, ease: "back.out(2)" }).to("#v16b", at("ai", 759.03), { rotation: 6, duration: 0.3, ease: "back.out(2)" })
    .out("#v16h, #v16a, #v16b", "END", { stagger: 0.03 });
  S.push(s);
}

/* ===================== Camera part 2: the action ===================== */
/* 31 Your action, built step by step */
{
  const steps = [["Sign up for Notion (free)", "one", 770.17], ["Paste the prompt below", "paste", 802.78], ["Connect Notion to Claude", "connect", 810.72]];
  const s = scene("s31", 763.95, at("go", 821.76) + 0.6, `<div class="zone">
    <div id="s31a" class="st cy" style="width:580px"><span class="pill">Your action</span><div class="h md">Job Site Prep</div>
      <ul class="list tight" style="gap:10px">${steps.map(([t], i) => `<li id="s31i${i}"><span class="n">${i + 1}</span><b>${t}</b></li>`).join("")}</ul></div>
  </div>`);
  s.set(steps.map((_, i) => `#s31i${i}`).join(","), { opacity: 0 }).pop("#s31a", 764.3, { from: { y: -60 } });
  steps.forEach(([, w, near], i) => s.pop(`#s31i${i}`, at(w, near) - 0.2, { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.out("#s31a", "END");
  S.push(s);
}
/* 32 End card */
{
  const s = scene("s32", at("go", 821.76) + 0.6, "END", `<div class="zone">
    <div id="s32a" class="st te" style="padding:36px 44px;max-width:620px"><span class="pill">Your action</span><div class="h big" style="font-size:76px">Job Site Prep</div><div class="b">The prompt is right below.</div><div id="s32ar" class="h big" style="align-self:center">&darr;</div></div>
    <div id="s32n" class="st sm" style="rotate:2deg;align-self:flex-end"><div class="l">Next</div><div class="b"><b>1.4 Lay the Foundation</b></div></div>
  </div>`);
  s.pop("#s32a", at("go", 821.76) + 0.65, { from: { y: -60 }, dur: 0.7 })
    .fromTo("#s32ar", at("go", 821.76) + 1.6, { y: -16 }, { y: 12, duration: 0.5, ease: "power2.inOut", repeat: 3, yoyo: true })
    .pop("#s32n", at("go", 821.76) + 1.3, { from: { x: 60 } });
  S.push(s);
}

/* ---------- captions (burned in, bottom band; Brittany 2026-11-16) ---------- */
const inKeep = (t) => keep.some(([a, b]) => t >= a && t < b);
const FIX = { "notion": "Notion", "cloth": "Claude", "club": "Claude", "pdf": "PDF", "pdfs": "PDFs", "md": "MD", "markdown": "Markdown" };
const FIXAT = { "2.4": "Job Site", "73.5": "guide.", "472.4": "front.", "648.1": "copy", "656.6": "Housecall", "657.1": "Pro,", "657.6": "Jobber,", "657.7": "JobNimbus,", "658.2": "~DEL~", "658.7": "~DEL~", "625.3": "Claude", "802.2": "lesson" };
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
const cwF = cw.filter((w) => w.text !== "~DEL~");
cw.length = 0; cw.push(...cwF);
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
