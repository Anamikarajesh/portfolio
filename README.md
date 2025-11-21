# portfolio
my cutesy portfolio guys

Local preview
-------------

1. The images are expected to be in the following structure (which matches your attachments):

   - `resources/cursor/cat_mouth_open.png`
   - `resources/cursor/cat_mouth_close.png`
   - `resources/cat meme/nyan_cat_without_rainbow.gif`
   - `resources/cat meme/hacker_cat_gif.gif`
   - `resources/cat meme/coding_cat.jpg`

2. Start a simple static HTTP server from the project root. Example with Python 3 (Windows `cmd.exe`):```
cd d:\cutesy_portfolio\portfolio
python -m http.server 8000
```

3. Open `http://localhost:8000/` in a browser.

Notes
-----
- The site hides the system cursor and uses your cat image following the pointer. On click the mouth image swaps to the closed version briefly.
- The nyan cats are animated via CSS and positioned with JS — they use `image-rendering: pixelated` so pixel art stays crisp.

