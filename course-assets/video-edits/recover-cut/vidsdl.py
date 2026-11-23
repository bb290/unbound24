import json,subprocess,os,sys,time,re
FID,OUT=sys.argv[1],sys.argv[2]
P=lambda url,*a: subprocess.run(["composio","proxy",url,"-t","googledrive","--account","googledrive_love-saify",*a],stdin=subprocess.DEVNULL,capture_output=True,text=True).stdout
for _ in range(40):
    op=json.loads(P(f"https://www.googleapis.com/drive/v3/files/{FID}/download?mimeType=video/mp4","-X","POST"))
    if op.get("done"): break
    time.sleep(10)
U=op["response"]["downloadUri"]
h=json.loads(P(U,"-H","Range: bytes=0-1023"))
cr=(h.get("headers") or {}).get("content-range") or (h.get("headers") or {}).get("Content-Range")
SIZE=int(cr.split("/")[1]); CH=50*1024*1024
out=open(OUT,"wb")
for s in range(0,SIZE,CH):
    e=min(s+CH,SIZE)-1
    d=json.loads(P(U,"-H",f"Range: bytes={s}-{e}"))
    subprocess.run(["curl","-sS","-o",OUT+".part",d["binary_data"]["url"]],check=True)
    out.write(open(OUT+".part","rb").read())
out.close(); os.remove(OUT+".part"); print(OUT,SIZE,os.path.getsize(OUT))
