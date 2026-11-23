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
