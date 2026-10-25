# Векторизует знак BRK из PNG старого сайта (1000x1000, белые буквы на чёрном) в src/three/knight-path.svg.
# Запуск: python -I scripts/trace-logo.py   (нужны pillow и potracer)
from PIL import Image
import potrace

SRC = 'public/assets/old-site/brand/6137-6138-Brk_png.png'
img = Image.open(SRC).convert('L')
w, h = img.size
bmp = potrace.Bitmap([[1 if img.getpixel((x, y)) > 128 else 0 for x in range(w)] for y in range(h)])
path = bmp.trace(turdsize=20, alphamax=0.6, opticurve=True, opttolerance=0.2)

d = []
xs, ys = [], []
for curve in path:
    s = curve.start_point
    d.append(f'M{s.x:.2f},{s.y:.2f}')
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f'L{seg.c.x:.2f},{seg.c.y:.2f}L{seg.end_point.x:.2f},{seg.end_point.y:.2f}')
            xs += [seg.c.x, seg.end_point.x]; ys += [seg.c.y, seg.end_point.y]
        else:
            d.append(f'C{seg.c1.x:.2f},{seg.c1.y:.2f} {seg.c2.x:.2f},{seg.c2.y:.2f} {seg.end_point.x:.2f},{seg.end_point.y:.2f}')
            xs += [seg.end_point.x]; ys += [seg.end_point.y]
    d.append('Z')
x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
vb = f'{x0:.0f} {y0:.0f} {x1 - x0:.0f} {y1 - y0:.0f}'
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><path fill="#0B0B0B" fill-rule="evenodd" d="{"".join(d)}"/></svg>\n'
for out in ('src/three/knight-path.svg', 'public/brk.svg'):
    open(out, 'w').write(svg)
print('contours:', len(path), 'viewBox:', vb)
