import json,sys,wave,numpy as np
SR=16000
def load(f):
    w=wave.open(f);return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
A,B=sys.argv[1],sys.argv[2]
fa,ra=load(A+'.wav'),load(B+'.wav')
cuts=json.load(open(A+'.cuts.json'))
rec=np.zeros_like(fa)
for s,e,o in cuts:
    a,b=int(s*SR),int(e*SR); r=int(round((s+o)*SR))
    seg=ra[r:r+(b-a)]; rec[a:a+len(seg)]=seg
bad=[]
for i in range(0,len(fa)//SR):
    x=fa[i*SR:(i+1)*SR]; y=rec[i*SR:(i+1)*SR]
    if np.sqrt(np.mean(x**2))<0.006: continue
    v=np.dot(x,y)/(np.linalg.norm(x)*np.linalg.norm(y)+1e-9)
    if v<0.9: bad.append((i,round(float(v),2)))
print('seconds below 0.9:',bad)
