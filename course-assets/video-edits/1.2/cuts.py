import json
w=json.load(open('transcript.json'))
END=888.3
REMOVE=[(0,6.0),(14.25,15.35),(24.5,24.98),(26.08,26.4),(29.08,30.15),(54.7,57.1),(216.65,223.35),(289.4,289.85),(322.0,329.9),(482.3,490.6)
,(726.8,731.2)]
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
