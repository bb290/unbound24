import json,sys,wave,numpy as np,re,difflib,bisect
from scipy.signal import fftconvolve
SR=16000
def load(f):
    w=wave.open(f);return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
A,B=sys.argv[1],sys.argv[2]; RANGE=float(sys.argv[3]) if len(sys.argv)>3 else 4
fa,ra=load(A+'.wav'),load(B+'.wav')
n=lambda s: re.sub(r"[^a-z0-9']","",s.lower())
fw=json.load(open(A+'.words.json')); rw=json.load(open(B+'.words.json'))
sm=difflib.SequenceMatcher(None,[n(w['text']) for w in fw],[n(w['text']) for w in rw],autojunk=False)
pts=[]
for b in sm.get_matching_blocks():
    for k in range(b.size): pts.append((fw[b.a+k]['start'],rw[b.b+k]['start']-fw[b.a+k]['start']))
pts.sort(); pt=[p[0] for p in pts]
def coarse(t):
    i=bisect.bisect_left(pt,t); near=pts[max(0,i-3):i+3]
    return [p[1] for p in near] if near else None
WIN=int(0.8*SR); STEP=int(0.2*SR)
res=[]
for c in range(0,len(fa)-WIN,STEP):
    x=fa[c:c+WIN]
    if np.sqrt(np.mean(x**2))<0.006: res.append((c/SR,None,0)); continue
    cs=coarse(c/SR+0.4)
    if not cs: res.append((c/SR,None,0)); continue
    lo=min(cs)-RANGE; hi=max(cs)+RANGE
    r0=max(0,int((c/SR+lo)*SR)); r1=min(len(ra),int((c/SR+hi)*SR)+WIN)
    y=ra[r0:r1]
    if len(y)<WIN: res.append((c/SR,None,0)); continue
    cc=fftconvolve(y,x[::-1],mode='valid')
    # normalise
    e=np.sqrt(fftconvolve(y**2,np.ones(WIN),mode='valid')+1e-9)
    ncc=cc/(e*np.linalg.norm(x)+1e-9); k=int(np.argmax(ncc))
    res.append((c/SR,(r0+k)/SR-c/SR,float(ncc[k])))
json.dump(res,open(A+'.slide.json','w'))
good=[r for r in res if r[1] is not None and r[2]>0.8]
print('windows',len(res),'voiced',sum(1 for r in res if r[1] is not None),'good',len(good))
# group
segs=[]
for t,o,q in good:
    if segs and abs(segs[-1][2]-o)<0.003: segs[-1][1]=t+0.8
    else: segs.append([t,t+0.8,o])
for s,e,o in segs: print(f'final {s:7.2f}-{e:7.2f} raw {s+o:7.2f}-{e+o:7.2f} off {o:8.4f}')
json.dump(segs,open(A+'.segs.json','w'))
