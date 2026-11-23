import json,re,sys
def words(f):
    d=json.load(open(f))
    out=[]
    for s in d['transcription']:
        t=s['text'].strip()
        if not t or t.startswith('['): continue
        out.append({'text':t,'start':s['offsets']['from']/1000,'end':s['offsets']['to']/1000})
    return out
if __name__=='__main__':
    for n in sys.argv[1:]:
        w=words(n+'.json'); json.dump(w,open(n+'.words.json','w'))
        print(n,len(w))
