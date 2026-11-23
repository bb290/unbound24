import json,sys,wave,numpy as np
SR=16000
def load(f):
    w=wave.open(f);return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
A,B=sys.argv[1],sys.argv[2]
fa,ra=load(A+'.wav'),load(B+'.wav')
segs=json.load(open(A+'.segs.json'))
H=int(0.02*SR); W=int(0.12*SR)
nf=len(fa)//H; lab=[None]*nf; q=[0]*nf
for i in range(nf):
    t=i*H/SR; c=i*H
    x=fa[max(0,c-W//2):c+W//2]
    if len(x)<W or np.sqrt(np.mean(x**2))<0.003: continue
    cand=[s[2] for s in segs if s[0]-3<=t<=s[1]+3]
    best=(-2,None)
    for o in cand:
        r=c+int(round(o*SR))
        if r-W//2<0 or r+W//2>len(ra): continue
        y=ra[r-W//2:r+W//2]; d=np.linalg.norm(x)*np.linalg.norm(y)
        v=float(np.dot(x,y)/d) if d>0 else -1
        if v>best[0]: best=(v,o)
    if best[0]>0.85: lab[i]=best[1]; q[i]=best[0]
# fill None by nearest labelled neighbour on the left, then right
last=None
for i in range(nf):
    if lab[i] is None: lab[i]=last
    else: last=lab[i]
nxt=None
for i in range(nf-1,-1,-1):
    if lab[i] is None: lab[i]=nxt
    else: nxt=lab[i]
runs=[]
for i,o in enumerate(lab):
    t=i*H/SR
    if runs and runs[-1][2]==o: runs[-1][1]=t+H/SR
    else: runs.append([t,t+H/SR,o])
# merge tiny runs (<0.25s) into the previous run
changed=True
while changed:
    changed=False
    for k,r in enumerate(runs):
        if r[1]-r[0]<0.25 and len(runs)>1:
            if k>0: runs[k-1][1]=r[1]
            else: runs[1][0]=r[0]
            runs.pop(k); changed=True; break
    m=[]
    for r in runs:
        if m and m[-1][2]==r[2]: m[-1][1]=r[1]
        else: m.append(r)
    runs=m
for s,e,o in runs: print(f'final {s:7.2f}-{e:7.2f} ({e-s:5.2f}s) raw {s+o:8.3f}-{e+o:8.3f} off {o:8.4f}')
json.dump([[round(s,3),round(e,3),o] for s,e,o in runs],open(A+'.cuts.json','w'))
print(len(runs),'segments')
