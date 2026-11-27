import math, os, sys, io
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg
from PIL import Image

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
THEMES = {
  'carbon':    dict(bg='#221E1A', fg='#EFE8DC', moon='#E86823'),
  'magnesium': dict(bg='#EFE8DC', fg='#2B2622', moon='#B8501A'),
}
C = 24.0

def pt(rx, ry, tilt, th, cx=C, cy=C):
    a, t = math.radians(th), math.radians(tilt)
    x, y = rx*math.cos(a), ry*math.sin(a)
    return (cx + x*math.cos(t) - y*math.sin(t), cy + x*math.sin(t) + y*math.cos(t))

def arc(rx, ry, tilt, th1, th2, cx=C, cy=C):
    p1, p2 = pt(rx, ry, tilt, th1, cx, cy), pt(rx, ry, tilt, th2, cx, cy)
    large = 1 if abs(th2-th1) > 180 else 0
    sweep = 1 if th2 > th1 else 0
    return f"M{p1[0]:.2f} {p1[1]:.2f}A{rx} {ry} {tilt} {large} {sweep} {p2[0]:.2f} {p2[1]:.2f}"

def trail(rx, ry, tilt, th_from, th_to, col, w, n=10, cx=C, cy=C):
    s = ''
    step = (th_to - th_from)/n
    for i in range(n):
        op = ((i+1)/n)**1.6 * 0.95
        s += f'<path d="{arc(rx,ry,tilt,th_from+i*step,th_from+(i+1)*step+0.6,cx,cy)}" stroke="{col}" stroke-opacity="{op:.2f}" stroke-width="{w}" fill="none" stroke-linecap="butt"/>'
    return s

def glyph(ch, height, cx, cy):
    f = TTFont(os.path.join(os.path.dirname(__file__), 'Libron-Bold.woff2'))
    gs = f.getGlyphSet(); g = f.getBestCmap()[ord(ch)]
    from fontTools.pens.boundsPen import BoundsPen
    b = BoundsPen(gs); gs[g].draw(b); x0,y0,x1,y1 = b.bounds
    k = height/(y1-y0)
    p = SVGPathPen(gs)
    tp = TransformPen(p, (k, 0, 0, -k, cx - (x0+x1)/2*k, cy + (y0+y1)/2*k))
    gs[g].draw(tp)
    return p.getCommands()

def svg(body, bg, shape):
    if shape == 'tile':  back = f'<rect width="48" height="48" rx="11" fill="{bg}"/>'
    elif shape == 'disc': back = f'<circle cx="24" cy="24" r="24" fill="{bg}"/>'
    else: back = ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{back}{body}</svg>'

RX, RY, TILT = 19.5, 8.2, -22
MOON = -38

def opt_orbit(t):   # A: bold orbit + moon with trail
    bg, fg, mo = t['bg'], t['fg'], t['moon']
    rx, ry = 17.5, 9
    b  = f'<ellipse cx="24" cy="24" rx="{rx}" ry="{ry}" transform="rotate({TILT} 24 24)" fill="none" stroke="{fg}" stroke-opacity=".9" stroke-width="3.2"/>'
    b += trail(rx, ry, TILT, MOON-120, MOON, mo, 3.4)
    m = pt(rx, ry, TILT, MOON)
    b += f'<circle cx="{m[0]:.2f}" cy="{m[1]:.2f}" r="6.4" fill="{mo}" stroke="{bg}" stroke-width="2.4"/>'
    return b

def opt_planet(t):  # B/C: planet with ring passing in front, moon on ring
    bg, fg, mo = t['bg'], t['fg'], t['moon']
    pr = 8.4
    b  = f'<path d="{arc(RX,RY,TILT,180,360)}" stroke="{fg}" stroke-opacity=".75" stroke-width="2.8" fill="none"/>'
    b += f'<circle cx="24" cy="24" r="{pr}" fill="{fg}"/>'
    b += f'<path d="{arc(RX,RY,TILT,0,180)}" stroke="{bg}" stroke-width="6" fill="none"/>'
    b += f'<path d="{arc(RX,RY,TILT,0,180)}" stroke="{fg}" stroke-width="2.8" fill="none"/>'
    m = pt(RX, RY, TILT, MOON)
    b += f'<circle cx="{m[0]:.2f}" cy="{m[1]:.2f}" r="5.2" fill="{mo}" stroke="{bg}" stroke-width="2.2"/>'
    return b

def opt_mono(t):    # D: Libron D with orbit + moon
    bg, fg, mo = t['bg'], t['fg'], t['moon']
    rx, ry, tilt, cy = 20, 6.2, -16, 27
    b  = f'<path d="{arc(rx,ry,tilt,180,360,cy=cy)}" stroke="{fg}" stroke-opacity=".55" stroke-width="2.4" fill="none"/>'
    b += f'<path d="{glyph("D", 21, 23.6, 22.6)}" fill="{fg}"/>'
    b += f'<path d="{arc(rx,ry,tilt,0,180,cy=cy)}" stroke="{bg}" stroke-width="5.4" fill="none"/>'
    b += f'<path d="{arc(rx,ry,tilt,0,180,cy=cy)}" stroke="{fg}" stroke-opacity=".9" stroke-width="2.4" fill="none"/>'
    m = pt(rx, ry, tilt, -28, cy=cy)
    b += f'<circle cx="{m[0]:.2f}" cy="{m[1]:.2f}" r="4.8" fill="{mo}" stroke="{bg}" stroke-width="2.2"/>'
    return b

def opt_dmoon(t):   # E: D whose bowl is the orbit, moon riding it with a fading trail
    bg, fg, mo = t['bg'], t['fg'], t['moon']
    H, cx, cy = 27, 22.2, 24
    k = H/1396
    rx, ry = 721*k, 698*k
    b  = f'<path d="{glyph("D", H, cx, cy)}" fill="{fg}"/>'
    b += trail(rx+3.4, ry+3.4, 0, 95, -40, mo, 2.8, n=14, cx=cx, cy=cy)
    m = pt(rx+1.4, ry+1.4, 0, -40, cx, cy)
    b += f'<circle cx="{m[0]:.2f}" cy="{m[1]:.2f}" r="5.6" fill="{mo}" stroke="{bg}" stroke-width="2.2"/>'
    return b

OPTIONS = {
  'dmoon':  (opt_dmoon, 'tile'),
  'orbit':  (opt_orbit, 'tile'),
  'planet': (opt_planet, 'tile'),
  'disc':   (opt_planet, 'disc'),
  'mono':   (opt_mono, 'tile'),
}
SIZES = [16, 32, 48, 96, 180, 192, 512]
for name, (fn, shape) in OPTIONS.items():
    for tn, t in THEMES.items():
        s = svg(fn(t), t['bg'], shape)
        base = f'{OUT}/{name}-{tn}'
        open(base+'.svg','w').write(s)
        for px in SIZES:
            # render big then downsample: closer to how Google/browsers resample
            png = cairosvg.svg2png(bytestring=s.encode(), output_width=px*8, output_height=px*8)
            im = Image.open(io.BytesIO(png)).convert('RGBA').resize((px,px), Image.LANCZOS)
            im.save(f'{base}-{px}.png', optimize=True)
print('done')
