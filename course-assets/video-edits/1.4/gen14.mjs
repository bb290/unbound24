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
/* Lesson 1.4 Lay the Foundation: scenes on the Nov 3 take (times are in the tightened cut, which is the published cut) */
const EXTRA_CSS = `
.list.tight{gap:8px}.list.tight li{grid-template-columns:44px 1fr;gap:0 10px}.list.tight b{font-size:36px}.list.tight span:not(.n){font-size:28px}.list.tight .n{font-size:34px}
.flow{display:flex;flex-direction:column;align-items:center;gap:6px}
.down{font:500 28px/1 "DM Mono";letter-spacing:.06em;text-transform:uppercase;background:#FFFBF4;border:3px solid #121318;border-radius:999px;padding:6px 14px}
.math{display:flex;align-items:baseline;gap:14px;font:800 64px/1 "Rubik";letter-spacing:-.02em}
.math .op{font-size:48px}
.strike{position:relative}.strike::after{content:"";position:absolute;left:-6px;right:-6px;top:52%;height:7px;background:#121318;border-radius:4px;transform:scaleX(var(--s,0));transform-origin:left}
`;
const house = (p) => houseSVG().replace(/id="/g, `id="${p}`).replace("url(#cement)", `url(#${p}cement)`);

/* 01 Title */
{
  const s = scene("s01", 0, at("So", 6.3) - 0.3, `<div class="zone">
    <div id="s01a" class="st li" style="padding:36px 44px"><span class="pill">Lesson 1.4</span><div class="h big">Lay the Foundation</div><div class="l">Hands-On AI</div></div>
  </div>`);
  s.pop("#s01a", at("lesson", 2.45), { from: { y: -80, rotation: -4 }, dur: 0.7 }).out("#s01a", "END");
  S.push(s);
}
/* 02 An honest picture */
{
  const s = scene("s02", at("So", 6.3) - 0.3, at("So", 17.7) - 0.3, `<div class="zone">
    <div id="s02a" class="st" style="rotate:-2deg"><div class="h">Before you<br>fix anything</div></div>
    ${tagH("s02t", "Get an honest picture", "te", 2)}
  </div>`);
  s.pop("#s02a", at("fix", 9.65)).pop("#s02t", at("honest", 13.42), { from: { y: 40 } }).out("#s02a, #s02t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 03 Less talking, more doing */
{
  const s = scene("s03", at("So", 17.7) - 0.3, at("backfill", 29.85) - 0.6, `<div class="zone">
    <div id="s03a" class="st cy" style="rotate:-2deg"><div class="h big">Less talking.</div></div>
    <div id="s03b" class="st" style="rotate:2deg;align-self:flex-end;margin-right:30px"><div class="h big">More doing.</div></div>
  </div>`);
  s.pop("#s03a", at("talking", 20.48), { from: { y: -60 } }).pop("#s03b", at("doing.", 21.92), { from: { y: 60 } })
    .out("#s03a, #s03b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 04 Backfill your SOPs: how it works */
{
  const s = scene("s04", at("backfill", 29.85) - 0.4, at("pillars", 47.5) - 2.6, `<div class="zone">
    <div class="flow">
      <div id="s04a" class="st te"><div class="l">Your action</div><div class="h md">Backfill your SOPs</div></div>
      <span id="s04d1" class="down">&darr;</span>
      <div id="s04b" class="st sm"><div class="b"><b>Claude interviews you</b></div></div>
      <span id="s04d2" class="down">&darr;</span>
      <div id="s04c" class="st sm li"><div class="b"><b>You answer</b></div></div>
      <span id="s04d3" class="down">&darr;</span>
      <div id="s04e" class="st sm cy"><div class="b">It writes it into <b>Notion</b></div></div>
    </div>
  </div>`);
  s.pop("#s04a", at("backfill", 29.85), { from: { y: -60 } })
    .pop("#s04d1, #s04b", at("interview", 33.14), { stagger: 0.12 })
    .pop("#s04d2, #s04c", at("answer", 34.54), { stagger: 0.12 })
    .pop("#s04d3, #s04e", at("notion", 38.96), { stagger: 0.12 })
    .out("#s04a, #s04d1, #s04b, #s04d2, #s04c, #s04d3, #s04e", "END", { stagger: 0.02 });
  S.push(s);
}
/* 05 Where the house is weak */
{
  const s = scene("s05", at("pillars", 47.5) - 2.6, at("lie,", 55.62) - 1.2, `<div class="zone">
    <div id="hw5">${house("a")}</div>
    ${tagH("s05t", "See what's broken", "li", -2)}
  </div>`);
  s.set("#aoutline", { opacity: 0 }).set("#apcC, #apcO, #apcD, #apcE, #aplC, #aplO, #aplD, #aplE", { opacity: 1 })
    .pop("#hw5", at("pillars", 47.5) - 2.4)
    .to("#apsO, #aplO", at("pillars", 47.5), { scaleY: 0.5, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.inOut" })
    .pop("#s05t", at("pillars", 47.5) + 0.4, { from: { y: 40 } })
    .out("#hw5, #s05t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 06 Don't sugarcoat it */
{
  const s = scene("s06", at("lie,", 55.62) - 1.2, at("mind", 70.97) - 1.2, `<div class="zone">
    <div id="s06a" class="st gr" style="rotate:-2deg"><div class="h big">Don't<br>sugarcoat it.</div></div>
    ${tagH("s06t", "Who are you lying to?", "cy", 2)}
  </div>`);
  s.pop("#s06a", at("lie,", 55.62) - 0.6, { from: { y: -60 } }).pop("#s06t", at("sugarcoating", 59.74) + 1.5, { from: { y: 40 } })
    .out("#s06a, #s06t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 07 How it works vs how it should */
{
  const s = scene("s07", at("mind", 70.97) - 1.2, at("So", 87.51) - 0.3, `<div class="zone">
    <div id="s07b" class="st sm" style="rotate:2deg;align-self:flex-end;margin-right:20px"><div class="l">Not</div><div class="h md"><span id="s07s" class="strike">How it should work</span></div></div>
    <div id="s07a" class="st te" style="rotate:-2deg"><div class="l">Write down</div><div class="h">How it actually works</div></div>
  </div>`);
  s.pop("#s07b", at("mind", 70.97), { from: { y: -40 } })
    .fromTo("#s07s", at("honest,", 76.97), { "--s": 0 }, { "--s": 1, duration: 0.45, ease: "power2.inOut" })
    .pop("#s07a", at("honest,", 76.97) + 0.6, { from: { y: 60 } })
    .out("#s07a, #s07b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 08 Where do leads come in */
{
  const items = [["Website", "website", 94.6], ["Phone calls", "phone", 108.48], ["Emails", "emails.", 109.52], ["Texts", "text", 110.56], ["Scraps of paper", "paper", 113.85]];
  const s = scene("s08", at("So", 87.51) - 0.3, at("fix", 127.98) - 0.8, `<div class="zone">
    <div id="s08a" class="st" style="width:540px"><div class="l">Where leads come in</div>
      <ul class="list tight" style="gap:10px">${items.map(([t], i) => `<li id="s08i${i}" style="grid-template-columns:30px 1fr"><span class="n" style="width:22px;height:22px;border-radius:99px;background:#03C0E8;border:4px solid #121318;align-self:center"></span><b>${t}</b></li>`).join("")}</ul></div>
    ${tagH("s08t", "Find the leaks", "te", -3)}
  </div>`);
  s.set(items.map((_, i) => `#s08i${i}`).join(","), { opacity: 0 }).pop("#s08a", at("lead", 87.96));
  items.forEach(([, w, near], i) => s.pop(`#s08i${i}`, at(w, near), { from: { scale: 1, x: -24 }, dur: 0.4 }));
  s.pop("#s08t", at("leaking.", 122.66), { from: { y: 40 } }).out("#s08a, #s08t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 09 One thing at a time */
{
  const s = scene("s09", at("fix", 127.98) - 0.8, at("forget", 150.58) - 1.0, `<div class="zone">
    <div id="s09a" class="st li" style="rotate:-2deg"><div class="h">You can't fix<br>everything at once.</div></div>
    <div id="s09b" class="st sm" style="rotate:2deg"><div class="l">Step one, maybe</div><div class="b"><b>Get every lead into the system</b></div></div>
  </div>`);
  s.pop("#s09a", at("fix", 127.98) - 0.3, { from: { y: -60 } }).pop("#s09b", at("enter", 143.52), { from: { y: 40 } })
    .out("#s09a, #s09b", "END", { stagger: 0.04 });
  S.push(s);
}
/* 10 Forgot to invoice */
{
  const s = scene("s10", at("forget", 150.58) - 1.0, at("So,", 174.64) - 0.2, `<div class="zone">
    <div id="s10a" class="st gr" style="rotate:-2deg"><div class="l">Forgot to invoice</div><div class="h md">30% of jobs</div></div>
    <div id="s10b" class="st" style="padding:22px 30px">
      <div class="math"><span id="s10n1">20 jobs</span><span id="s10x" class="op">&times;</span><span id="s10n2">$500</span></div>
    </div>
    <div id="s10r" class="st te" style="rotate:2deg;padding:20px 30px"><div class="math"><span class="op">=</span><span>$10,000</span></div><div class="l">every week</div></div>
  </div>`);
  s.set("#s10b", { opacity: 0 }).set("#s10n1, #s10x, #s10n2, #s10r", { opacity: 0 })
    .pop("#s10a", at("30%", 159.82) - 0.4, { from: { y: -60 } })
    .to("#s10b", at("20", 167.52) - 0.2, { opacity: 1, duration: 0.25 })
    .pop("#s10n1", at("20", 167.52), { from: { x: -30, scale: 1 } })
    .pop("#s10x, #s10n2", at("$500", 170.68), { from: { x: -30, scale: 1 }, stagger: 0.1 })
    .pop("#s10r", at("500", 172.69) + 0.4, { from: { y: 40 } })
    .out("#s10a, #s10b, #s10r", "END", { stagger: 0.04 });
  S.push(s);
}
/* 11 Be honest */
{
  const s = scene("s11", at("So,", 174.64) - 0.2, at("first", 183.52) - 1.0, `<div class="zone">
    <div id="s11a" class="st cy" style="rotate:-2deg"><div class="h big">Be honest.</div></div>
    ${tagH("s11t", "No one sees it but you", "li", 2)}
  </div>`);
  s.pop("#s11a", at("honest,", 177.61), { from: { y: -60 } }).pop("#s11t", at("honest,", 177.61) + 2.2, { from: { y: 40 } })
    .out("#s11a, #s11t", "END", { stagger: 0.04 });
  S.push(s);
}
/* 12 Round one, then iterate */
{
  const s = scene("s12", at("first", 183.52) - 1.0, at("foundations,", 199.0) - 1.0, `<div class="zone">
    <div class="flow">
      <div id="s12a" class="st sm te"><div class="l">Round one</div><div class="b"><b>Get it all documented</b></div></div>
      <span id="s12d" class="down">&darr; then</span>
      <div id="s12b" class="st sm"><div class="l">Every lesson after</div><div class="b"><b>Make it better and better</b></div></div>
    </div>
  </div>`);
  s.pop("#s12a", at("first", 183.52), { from: { y: -40 } }).pop("#s12d, #s12b", at("better", 197.06) - 2.5, { stagger: 0.12 })
    .out("#s12a, #s12d, #s12b", "END", { stagger: 0.03 });
  S.push(s);
}
/* 13 The house goes up */
{
  const s = scene("s13", at("foundations,", 199.0) - 1.0, at("brand.", 205.41) + 0.2, `<div class="zone"><div id="hw13">${house("b")}</div></div>`);
  s.set("#bfnd, #bpC, #bpO, #bpD, #bpE, #broof", { opacity: 0 }).set("#bpcC, #bpcO, #bpcD, #bpcE, #bplC, #bplO, #bplD, #bplE", { opacity: 1 })
    .pop("#hw13", at("foundations,", 199.0) - 0.8, { from: { scale: 0.9 } })
    .pop("#bfnd", at("foundations,", 199.0), { from: { y: 30, scale: 1 } })
    .pop("#bpC, #bpO, #bpD, #bpE", at("pillars", 200.35), { from: { y: 40, scale: 1 }, stagger: 0.1 })
    .pop("#broof", at("brand.", 205.41) - 0.6, { from: { y: -50, scale: 1 } })
    .out("#hw13", "END");
  S.push(s);
}
/* 14 End card */
{
  const s = scene("s14", at("brand.", 205.41) + 0.2, "END", `<div class="zone">
    <div id="s14a" class="st te" style="padding:36px 44px;max-width:620px"><span class="pill">Your action</span><div class="h big" style="font-size:76px">Backfill your SOPs</div><div class="b">The prompt is right below.</div><div id="s14ar" class="h big" style="align-self:center">&darr;</div></div>
    <div id="s14n" class="st sm" style="rotate:2deg;align-self:flex-end"><div class="l">Next</div><div class="b"><b>Get It Out of Your Head</b></div></div>
  </div>`);
  s.pop("#s14a", at("brand.", 205.41) + 0.25, { from: { y: -60 }, dur: 0.7 })
    .fromTo("#s14ar", at("brand.", 205.41) + 1.2, { y: -16 }, { y: 12, duration: 0.5, ease: "power2.inOut", repeat: 3, yoyo: true })
    .pop("#s14n", at("brand.", 205.41) + 1.0, { from: { x: 60 } });
  S.push(s);
}

/* ---------- captions (burned in, bottom band; Brittany 2026-11-16) ---------- */
const inKeep = (t) => keep.some(([a, b]) => t >= a && t < b);
const FIX = { "recipes": "SOPs", "notion": "Notion", "lay": "Lay" };
const FIXAT = {};
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
