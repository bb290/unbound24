# Recover a cut from a published video

Used 2026-11-19 to rebrand Lessons 1.3 and 1.4 when their original edit projects were gone (the old scratchpad had been cleared). The published final has the old graphics baked in, so the cut is rebuilt from the raw take by matching audio.

1. Get the raw take and the final. Raw Vids recordings: `python3 vidsdl.py <vids file id> out.mp4` (Composio Drive, Unbound24 account). Drive files: `python3 dl.py <id> <size> out.mp4`.
2. Make 16 kHz mono wavs of both and transcribe each with whisper-cli (`-ml 1 -sow -ojf`), then `words.py <name>...` to write `<name>.words.json`.
3. `slide.py <final> <raw>`: word matching gives rough offsets, then 0.8 s audio windows find the exact raw offset of each stretch.
4. `cutlist.py <final> <raw>` writes `<final>.cuts.json`: `[final start, final end, offset]`, so raw = final + offset.
5. `verify.py <final> <raw>` lists any second that doesn't match. Weak spots are usually where the old edit had a sound effect or music; check them with `brute.py`.

Section with a different source (1.3's voiceover redo): cut the final's audio for that stretch and run the same steps against the voiceover files. The `*.cuts.json` here are the results for 1.4 (`lf`) and 1.3 (`jsp`, `jsp-vo`). Needs numpy and scipy (a venv).
