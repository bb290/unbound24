import wave,numpy as np,sys
SR=16000
def load(f):
    w=wave.open(f);return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
fa,ra=load(sys.argv[1]+'.wav'),load(sys.argv[2]+'.wav')
t0,t1,r0,r1=map(float,sys.argv[3:7])
W=int(0.25*SR)
for t in np.arange(t0,t1,0.125):
    c=int(t*SR); x=fa[c:c+W]
    if np.sqrt(np.mean(x**2))<0.01: print(f'{t:7.2f} quiet'); continue
    best=(-1,0)
    for r in range(int(r0*SR),int(r1*SR),8):
        y=ra[r:r+W]; d=np.linalg.norm(y)
        if d<1e-3: continue
        v=np.dot(x,y)/(np.linalg.norm(x)*d)
        if v>best[0]: best=(v,r)
    print(f'{t:7.2f} raw {best[1]/SR:8.3f} off {best[1]/SR-t:7.3f} ncc {best[0]:.2f}')
