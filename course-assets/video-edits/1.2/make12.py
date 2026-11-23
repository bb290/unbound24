src=open('../v11/build.mjs').read()
parts=open('parts.mjs').read()
a=src.index('const beats = [');b=src.index('/* ---------- page ---------- */')
src=src[:a]+parts.split('\n',1)[1]+'\n'+src[b:]
def swap(start_marker,end_marker,new):
  global src
  i=src.index(start_marker);j=src.index(end_marker,i)
  src=src[:i]+new+src[j:]
swap('<header>','<section id="calls">','''<header>
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

''')
swap('<section id="calls">','<section id="zone">','''<section id="calls">
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

''')
src=src.replace('<img src="${img(155)}" alt="Frame at 2:35 with the graphics area marked">','<img src="${img(300)}" alt="Frame at 5:00 with the graphics area marked">')
src=src.replace('You lean into that space a few times (your hands at 10:08, for one)','You lean into that space a few times when you gesture')
swap('<section id="cuts">','<section id="storyboard">','''<section id="cuts">
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

''')
css='''.g-list.tight{gap:.5cqw}.g-list.tight b{font-size:1.9cqw}.g-list.tight span{font-size:1.35cqw}
.g-list.bullets{list-style:none;padding-left:0}.g-list.bullets li::before{content:"";display:inline-block;width:.9cqw;height:.9cqw;margin-right:.8cqw;border-radius:99px;background:#40E0D0;border:.2cqw solid #121318}.g-list.bullets li b{display:inline}
.g-cube{display:grid;grid-template-columns:repeat(3,4.6cqw);gap:.4cqw;padding:.6cqw;background:#121318;border-radius:1cqw;rotate:-8deg;box-shadow:.55cqw .55cqw 0 rgba(18,19,24,.4)}
.g-cube span{aspect-ratio:1;border-radius:.5cqw}
.g-stack{display:flex;flex-direction:column;align-items:center;gap:1.2cqw}
.g-flow{display:flex;flex-direction:column;align-items:center;gap:.3cqw}
.g-down{font:500 1.2cqw/1 "DM Mono",monospace;letter-spacing:.06em;text-transform:uppercase;background:var(--v-cream);border-radius:99px;padding:.3cqw .8cqw}
'''
src=src.replace('@media (prefers-reduced-motion:no-preference)',css+'@media (prefers-reduced-motion:no-preference)')
src=src.replace('<title>Lesson 1.1 Storyboard</title>','<title>Lesson 1.2 Storyboard</title>')
src=src.replace('fs.writeFileSync(`${dir}storyboard.html`, html);','fs.writeFileSync(`${dir}lesson-1-2-storyboard.html`, html);')
open('build12.mjs','w').write(src)
