# Site icon

`final.py` draws the Disc icon (Carbon) and writes every size to `final/`:
favicon.svg (small-size cut, used up to 48 px), favicon-detail.svg (96 px and up),
PNGs 16–512, favicon.ico (16/32/48), apple-touch-icon.png and icon-maskable-512.png.
It reuses the drawing helpers in `gen.py`.

    pip install fonttools brotli cairosvg pillow
    cp ../../public/fonts/libron/Libron-Bold.woff2 .   # gen.py loads it
    python3 final.py

Then copy the outputs into `public/` (favicon.svg, favicon.ico, apple-touch-icon.png) and `public/icons/`.
