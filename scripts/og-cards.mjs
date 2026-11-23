// Renders the 1200x630 link-preview cards in public/og/ from scripts/og-cards.json, in the Unbound brand
// (DESIGN.md: cream, ink, cyan/teal/lilac fills, Rubik/Figtree/DM Mono, sticker shapes, torn highlight). Rebuilt
// 2026-11-17 (Brittany: "update the feature image on all the site pages with new brand").
// Usage: node scripts/og-cards.mjs [file ...]   (no args = every card)
// Needs Playwright. This project doesn't install it; borrow French Roofing's:
//   PLAYWRIGHT=/Users/unbound24/Unbound/clients/French_Roofing/node_modules/playwright/index.mjs node scripts/og-cards.mjs
// Each row: file, eyebrow, title, sub, art, optional pill (default "Free course"), color (cyan|teal|lilac),
// highlight (the words to put on the torn highlight; default the last word or two). Add a row for every new page.
import fs from 'fs';
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const L = JSON.parse(fs.readFileSync(new URL('./og-cards.json', import.meta.url), 'utf8'));
const PUB = new URL('../public', import.meta.url).pathname;
const only = process.argv.slice(2);
const COLORS = { cyan: '#03C0E8', teal: '#40E0D0', lilac: '#D3D3FF' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const logo = 'data:image/png;base64,' + fs.readFileSync(PUB + '/unbound-logo.png').toString('base64');

function splitTitle(title, highlight) {
  if (highlight && title.endsWith(highlight)) return [title.slice(0, -highlight.length), highlight];
  const words = title.split(' ');
  const n = words.length >= 4 ? 2 : 1;
  return [words.slice(0, -n).join(' ') + (words.length > n ? ' ' : ''), words.slice(-n).join(' ')];
}

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
let i = 0;
for (const l of L) {
  if (only.length && !only.includes(l.file)) continue;
  const color = COLORS[l.color] || Object.values(COLORS)[i++ % 3];
  const art = 'data:image/webp;base64,' + fs.readFileSync(PUB + l.art).toString('base64');
  const [lead, hi] = splitTitle(l.title, l.highlight);
  const size = l.title.length > 30 ? 62 : l.title.length > 20 ? 74 : 88;
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@800&family=Figtree:wght@600;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet"><style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#F8F0E3;color:#121318;font-family:Figtree,sans-serif;position:relative;overflow:hidden}
  .logo{position:absolute;left:64px;top:52px;height:46px}
  .left{position:absolute;left:64px;top:130px;width:640px;display:flex;flex-direction:column;gap:22px;align-items:flex-start}
  .label{font-family:'DM Mono',monospace;font-weight:500;font-size:20px;letter-spacing:.1em;text-transform:uppercase;background:${color};padding:10px 20px;border-radius:999px}
  h1{font-family:Rubik,sans-serif;font-weight:800;font-size:${size}px;line-height:1;letter-spacing:-.02em}
  .torn{display:inline-block;background:${color};padding:0 .14em;transform:rotate(-2deg);margin-top:.06em;
    clip-path:polygon(0% 8%,14% 0%,32% 6%,51% 0%,70% 5%,88% 0%,100% 7%,97% 38%,100% 66%,96% 100%,78% 93%,57% 100%,36% 94%,17% 100%,0% 93%,3% 62%,0% 34%)}
  .sub{font-size:28px;font-weight:600;color:#55514A;max-width:600px;line-height:1.25}
  .foot{position:absolute;left:64px;bottom:54px;display:flex;gap:18px;align-items:center}
  .pill{font-family:Figtree,sans-serif;font-weight:700;font-size:24px;background:#FFB27A;border:3px solid #121318;box-shadow:5px 5px 0 #121318;border-radius:999px;padding:10px 26px}
  .url{font-family:'DM Mono',monospace;font-weight:500;font-size:22px}
  .card{position:absolute;right:64px;top:92px;width:400px;height:430px;background:#FFFBF4;border:4px solid #121318;box-shadow:12px 12px 0 #121318;border-radius:32px;transform:rotate(2.5deg);display:flex;align-items:center;justify-content:center;padding:28px}
  .card img{max-width:100%;max-height:100%}
  .dot{position:absolute;right:420px;top:70px;width:46px;height:46px;border-radius:50%;background:${color};border:3px solid #121318}
  </style></head><body>
  <img class="logo" src="${logo}">
  <div class="left"><span class="label">${esc(l.eyebrow)}</span><h1>${esc(lead)}<span class="torn">${esc(hi)}</span></h1>${l.sub ? `<div class="sub">${esc(l.sub)}</div>` : ''}</div>
  <div class="foot"><span class="pill">${esc(l.pill ?? 'Free course')}</span><span class="url">unbound24.com</span></div>
  <div class="card"><img src="${art}"></div><div class="dot"></div>
  </body></html>`, { waitUntil: 'networkidle', timeout: 30000 });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${PUB}/og/${l.file}.png` });
  console.log('made', l.file);
}
await b.close();
