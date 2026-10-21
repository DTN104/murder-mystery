#!/usr/bin/env python3
"""Build the static HTTP distribution, with pinned local Three.js modules."""
import pathlib, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPTS = ['nights/night1.js','src/util.js','src/audio.js','src/assets.js','src/scenes.js','src/room-materials.js','src/room-scene.js','src/room-controls.js','src/room.js','src/monitor.js','src/chat.js','src/game.js']
css = (ROOT/'css/style.css').read_text()
markup = (ROOT/'src/markup.html').read_text()
js = '\n'.join((ROOT/s).read_text() for s in SCRIPTS)
fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Caveat:wght@500;700&display=swap">'
loader = '''<script type="module">
const startButton=document.querySelector('#start');startButton.disabled=true;
try{window.THREE=await import('./vendor/three/three.module.js');await import('./game.js');if(!CD.room.failed)startButton.disabled=false;}
catch(e){console.error(e);document.querySelector('#loadst').textContent='Không mở được game 3D. Hãy mở bằng HTTP và kiểm tra hỗ trợ WebGL.';}
</script>'''
artifact = f'<title>CA ĐÊM</title>\n{fonts}\n<style>\n{css}\n</style>\n{markup}\n{loader}'
full = '<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html{color-scheme:dark}body{margin:0}[hidden]{display:none!important}</style></head><body>'+artifact+'</body></html>'
dest=ROOT/'dist';dest.mkdir(exist_ok=True)
shutil.copytree(ROOT/'assets/opt',dest/'assets/opt',dirs_exist_ok=True)
shutil.copytree(ROOT/'vendor',dest/'vendor',dirs_exist_ok=True)
(dest/'game.js').write_text(js)
(dest/'desk.html').write_text(full)
shutil.copyfile(ROOT/'index.html',dest/'index.html')
shutil.copytree(ROOT/'case13',dest/'case13',dirs_exist_ok=True)
shutil.copytree(ROOT/'house09',dest/'house09',dirs_exist_ok=True)
for page in ['floor13.html','house09.html']:
    shutil.copyfile(ROOT/page,dest/page)
(dest/'desk-artifact.html').write_text(artifact)
shutil.copyfile(ROOT/'index.html',dest/'artifact.html')
print('Built HOUSE 09 at dist/index.html; TẦNG 13 at floor13.html; CA ĐÊM at desk.html.')
