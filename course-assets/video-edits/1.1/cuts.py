import json
w=json.load(open('transcript.json'))
END=725.2
# Approved cuts (raw seconds), from the storyboard
REMOVE=[(0,1.52),(150.63,164.30),(None,None),(None,None),(247.05,247.40),(248.05,254.52),(283.35,343.80),(388.0,394.75),(407.45,413.65),(515.70,524.80),(557.75,561.95),(588.15,590.45),(641.65,653.75),(679.2,689.65)]
def W(txt,near):
  c=[x for x in w if x['text'].strip('.,?!').lower()==txt.lower() and abs(x['start']-near)<3]
  return min(c,key=lambda x:abs(x['start']-near))
# Co uh C. stumble: from 'Co' start to the next 'C,' start
co=W('Co',170.5); REMOVE[2]=(co['start']-0.03, 175.70)
orr=W('or',239.5); REMOVE[3]=(orr['start']-0.03, W('five',239.8)['start']+0.45)
REMOVE=[r for r in REMOVE if r[0] is not None]
sil=[tuple(map(float,l.split())) for l in open('sil.txt')]
for s,e in sil:
  if e-s>1.0:
    a,b=s+0.28,e-0.28
    inside=[x['start'] for x in w if a<x['start']<b]
    if inside: b=min(b,min(inside)-0.15)
    if b-a>0.3: REMOVE.append((a,b))
REMOVE.sort()
merged=[]
for a,b in REMOVE:
  if merged and a<=merged[-1][1]: merged[-1]=(merged[-1][0],max(b,merged[-1][1]))
  else: merged.append((a,b))
keep=[];t=0
for a,b in merged:
  if a>t: keep.append((round(t,3),round(a,3)))
  t=max(t,b)
if t<END: keep.append((round(t,3),END))
json.dump(keep,open('keep.json','w'))
total=sum(b-a for a,b in keep)
print(len(keep),'segments, total',f'{int(total//60)}:{total%60:04.1f}')
def remap(t):
  acc=0
  for a,b in keep:
    if t<a: return acc
    if t<=b: return acc+t-a
    acc+=b-a
  return acc
# stitched text around each approved cut
for a,b in merged:
  if b-a>1.5 or a<2:
    before=' '.join(x['text'] for x in w if a-4<x['start']<a)
    after=' '.join(x['text'] for x in w if b<=x['start']<b+4)
    print(f'[{a:.1f}-{b:.1f}] ...{before} || {after}...')
json.dump({'keep':keep},open('keep.json','w'))
