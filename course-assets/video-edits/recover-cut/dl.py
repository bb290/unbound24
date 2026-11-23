import json,subprocess,sys,os
ID,SIZE,OUT=sys.argv[1],int(sys.argv[2]),sys.argv[3]; CH=50*1024*1024
out=open(OUT,"wb")
for s in range(0,SIZE,CH):
    e=min(s+CH,SIZE)-1
    r=subprocess.run(["composio","proxy",f"https://www.googleapis.com/drive/v3/files/{ID}?alt=media","-t","googledrive","--account","googledrive_love-saify","-H",f"Range: bytes={s}-{e}"],stdin=subprocess.DEVNULL,capture_output=True,text=True)
    d=json.loads(r.stdout); url=d["binary_data"]["url"]
    subprocess.run(["curl","-sS","-o",OUT+".part",url],check=True)
    out.write(open(OUT+".part","rb").read())
out.close(); os.remove(OUT+".part"); print(OUT, os.path.getsize(OUT))
