// Renders the 1200x630 link-preview cards in public/og/ from scripts/og-cards.json.
// Usage: node scripts/og-cards.mjs (needs playwright and Chrome). Add a row to og-cards.json for every new page.
import { chromium } from 'playwright';
import fs from 'fs';
const L = JSON.parse(fs.readFileSync(new URL('./og-cards.json', import.meta.url),'utf8'));
const PUB = new URL('../public', import.meta.url).pathname;
const b = await chromium.launch({channel:'chrome'}); const p = await b.newPage({viewport:{width:1200,height:630}});
for (const l of L) {
  const art = 'data:image/webp;base64,' + fs.readFileSync(PUB + l.art).toString('base64');
  await p.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap" rel="stylesheet"><style>
  *{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fff;font-family:Nunito,sans-serif;color:#0A1C33;position:relative;overflow:hidden}
  .bar{position:absolute;left:0;top:0;bottom:0;width:22px;background:#2ED4E8}
  .t{position:absolute;left:84px;top:96px;width:620px}
  .k{color:#C01F7A;font-weight:900;font-size:30px;letter-spacing:.14em;text-transform:uppercase}
  h1{font-size:${l.title.length>26?64:l.title.length>18?76:96}px;font-weight:900;line-height:1.02;letter-spacing:-.02em;margin:18px 0 22px}
  .c{font-size:30px;font-weight:800;color:#5B6B80}
  .u{position:absolute;left:84px;bottom:64px;display:flex;gap:14px;align-items:center;font-weight:900;font-size:30px}
  .pill{background:#2ED4E8;border-radius:99px;padding:10px 26px}
  .art{position:absolute;right:56px;top:50%;transform:translateY(-50%);width:420px;height:470px;display:flex;align-items:center;justify-content:center}
  .art img{max-width:100%;max-height:100%}
  .bricks{position:absolute;left:84px;top:62px;display:flex;gap:8px}.bricks i{width:44px;height:18px;border-radius:5px;background:#2ED4E8}.bricks i:last-child{background:#E8399B}
  </style></head><body><div class="bar"></div><div class="bricks"><i></i><i></i><i></i></div>
  <div class="t"><div class="k">${l.eyebrow}</div><h1>${l.title}</h1><div class="c">${l.sub}</div></div>
  <div class="u"><span class="pill">Free course</span><span>unbound24.com</span></div>
  <div class="art"><img src="${art}"></div></body></html>`, {waitUntil:'domcontentloaded', timeout:20000});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(700);
  await p.screenshot({path:`${PUB}/og/${l.file}.png`});
}
await b.close(); console.log('ok', L.length);
