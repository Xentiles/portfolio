import math, io, os, sys
sys.argv=['x','out']
exec(open('gen.py').read().split("OPTIONS = {")[0])
import cairosvg
from PIL import Image
T = THEMES['carbon']
BG, FG, MO = T['bg'], T['fg'], T['moon']

def hexmix(a, b, t):
    a=[int(a[i:i+2],16) for i in (1,3,5)]; b=[int(b[i:i+2],16) for i in (1,3,5)]
    return '#'+''.join(f'{round(x+(y-x)*t):02X}' for x,y in zip(a,b))

def trail_mix(rx, ry, tilt, th_from, th_to, base, col, w, n=24):
    """Ring segment whose colour warms from the ring's own tone to the moon's orange."""
    s = ''; step = (th_to-th_from)/n
    for i in range(n):
        t = ((i+1)/n)**1.3 if col == MO else (i+1)/n
        s += f'<path d="{arc(rx,ry,tilt,th_from+i*step,th_from+(i+1)*step+0.4)}" stroke="{hexmix(base,col,t)}" stroke-width="{w}" fill="none"/>'
    return s

def comp(small=False, k=1.0):
    """Planet, ring passing in front, moon with a fading trail that slips behind the planet."""
    rx, ry, tilt = 18.8*k, 7.8*k, -22
    pr = (8.6 if small else 8.0)*k
    rw = (3.5 if small else 2.6)*k        # ring weight
    tw = (3.7 if small else 2.9)*k        # trail weight
    mr = (6.0 if small else 5.0)*k        # moon radius
    hw = (2.0 if small else 2.0)*k        # moon halo
    moon = -28 if not small else -30
    back_op = .85 if small else .74
    b  = f'<path d="{arc(rx,ry,tilt,180,360)}" stroke="{FG}" stroke-opacity="{back_op}" stroke-width="{rw}" fill="none"/>'
    # trail rides the back of the ring into the moon; drawn before the planet so it slips behind it
    ring_tone = hexmix(BG, FG, back_op)
    # the back of the ring is a shade dimmer; blend into full tone at both tips so there is no step
    b += trail_mix(rx, ry, tilt, 180, 215, FG, ring_tone, rw, n=12).replace('stroke="#', 'stroke="#', 1)
    b += trail_mix(rx, ry, tilt, 360, 325, FG, ring_tone, rw, n=12)
    b += trail_mix(rx, ry, tilt, -96, moon, ring_tone, MO, rw)
    b += f'<circle cx="24" cy="24" r="{pr}" fill="{FG}"/>'
    b += f'<path d="{arc(rx,ry,tilt,0,180)}" stroke="{BG}" stroke-width="{rw+3.0*k}" fill="none"/>'
    b += f'<path d="{arc(rx,ry,tilt,0,180)}" stroke="{FG}" stroke-width="{rw}" fill="none"/>'
    m = pt(rx, ry, tilt, moon)
    b += f'<circle cx="{m[0]:.2f}" cy="{m[1]:.2f}" r="{mr}" fill="{MO}" stroke="{BG}" stroke-width="{hw}" paint-order="stroke"/>'
    return b

def disc(small=False):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="{BG}"/><g transform="translate(-0.5 0.7)">{comp(small)}</g></svg>'
def square(k):  # opaque full-bleed square for iOS / maskable icons
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="{BG}"/><g transform="translate({24-24*k} {24-24*k}) scale({k})">{comp(False)}</g></svg>'

def png(svg, px, path, ss=8):
    raw = cairosvg.svg2png(bytestring=svg.encode(), output_width=px*ss, output_height=px*ss)
    im = Image.open(io.BytesIO(raw)).convert('RGBA').resize((px,px), Image.LANCZOS)
    im.save(path, optimize=True); return im

O='final'; os.makedirs(O, exist_ok=True)
big, small = disc(False), disc(True)
open(f'{O}/favicon.svg','w').write(small)      # tabs and Google draw it at 16-36 px
open(f'{O}/favicon-detail.svg','w').write(big)
for px in (16, 32, 48): png(small, px, f'{O}/favicon-{px}.png')
for px in (96, 192, 512): png(big, px, f'{O}/favicon-{px}.png')
png(square(0.86), 180, f'{O}/apple-touch-icon.png')
png(square(0.80), 512, f'{O}/icon-maskable-512.png')
open(f'{O}/maskable.svg','w').write(square(0.80))
ims=[Image.open(f'{O}/favicon-{p}.png') for p in (16,32,48)]
ims[2].save(f'{O}/favicon.ico', sizes=[(16,16),(32,32),(48,48)], append_images=ims[:2])
# old disc for comparison
print(os.listdir(O))
