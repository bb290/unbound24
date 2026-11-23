# Builds a lesson generator from the 1.2 one: shared header (look, house, motion helpers) + this lesson's scenes + captions/writer.
import sys,re
src=open('/Users/unbound24/Unbound/clients/Unbound24/course-assets/video-edits/1.2/gen12.mjs').read()
scenes_file,out,pad,fix,fixat=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]
head=src[:src.index('const S = [];')+len('const S = [];')]
foot=src[src.index('/* ---------- captions'):]
head=head.replace('// Generates the HyperFrames project for Lesson 1.1 (hf/)','// Generates the HyperFrames project (hf/)')
head=head.replace('const PAD = 3;',f'const PAD = {pad};')
foot=re.sub(r'const FIX = \{[^\n]*\};',f'const FIX = {fix};',foot)
foot=re.sub(r'const FIXAT = \{[^\n]*\};',f'const FIXAT = {fixat};',foot)
foot=foot.replace('const groups = [];','const cwF = cw.filter((w) => w.text !== "~DEL~");\ncw.length = 0; cw.push(...cwF);\nconst groups = [];',1)
open(out,'w').write(head+'\n'+open(scenes_file).read()+'\n'+foot)
print('wrote',out)
