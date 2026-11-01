# Builds the zip to upload to CrazyGames (developer.crazygames.com) from this
# repository's index.html:
#   - three.js and Ammo.js are put in the zip and loaded from it (relative paths),
#   - the app install parts (manifest, icons, service worker) are left out,
#   - window.MT_PORTAL is set, so challenges are codes rather than links back to
#     this site (CrazyGames doesn't allow links to the game elsewhere),
#   - the online features stay on (online.js and online-config.js, Firebase),
#     shared with the hosted page.
# Usage: python3 tools/build_crazygames.py [out.zip]   (run from the repository root)
import io, sys, urllib.request, zipfile, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'mushtaqtrack-crazygames.zip')
html = (root / 'index.html').read_text(encoding='utf-8')

THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
AMMO = 'https://cdn.jsdelivr.net/npm/three@0.110.0/examples/js/libs/ammo.js'
def swap(a, b):
    global html
    assert html.count(a) == 1, 'not found once: ' + a[:60]
    html = html.replace(a, b)

swap(f'<script src="{THREE}"></script>', '<script src="three.min.js"></script>')
swap(f'<script src="{AMMO}"></script>', '<script src="ammo.js"></script>')
swap('<link rel="manifest" href="manifest.webmanifest">\n', '')
swap('<link rel="apple-touch-icon" href="icon-180.png">\n', '')
swap("<script>if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));</script>\n", '')
swap('<script src="online-config.js"></script>', "<script>window.MT_PORTAL = 'crazygames';</script>\n<script src=\"online-config.js\"></script>")

def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as r: return r.read()

files = {
    'index.html': html.encode('utf-8'),
    'online.js': (root / 'online.js').read_bytes(),
    'online-config.js': (root / 'online-config.js').read_bytes(),
    'agent-theme.mp3': (root / 'agent-theme.mp3').read_bytes(),
    'music-menu.mp3': (root / 'music-menu.mp3').read_bytes(),
    'music-race.mp3': (root / 'music-race.mp3').read_bytes(),
    'three.min.js': fetch(THREE),
    'ammo.js': fetch(AMMO),
    'THIRD-PARTY.txt': (
        'three.js r128 (three.min.js): MIT licence, Copyright 2010-2021 three.js authors. https://github.com/mrdoob/three.js\n'
        'Ammo.js (ammo.js, as shipped with three.js 0.110.0): zlib licence, a port of the Bullet physics engine. https://github.com/kripken/ammo.js\n'
        'Music (music-menu.mp3, music-race.mp3): original, made for the game (tools/music.py).\n'
        'Music (agent-theme.mp3): "Classy and Dangerous (Inspired by 007)" by Luis_Humanoide, from Pixabay, under the Pixabay Content License. https://pixabay.com/service/license-summary/\n'
    ).encode('utf-8'),
}
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, data in files.items(): z.writestr(name, data)
out.write_bytes(buf.getvalue())
print(f'{out}: {len(files)} files, {out.stat().st_size / 1e6:.1f} MB zipped, {sum(map(len, files.values())) / 1e6:.1f} MB unzipped')
