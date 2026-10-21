#!/usr/bin/env python3
"""Serve the mystery games locally. Standard library only; no install step."""
import argparse
import functools
import http.server
import pathlib
import webbrowser

parser = argparse.ArgumentParser(description='Mở game điều tra trên máy này')
parser.add_argument('--port', type=int, default=0)
parser.add_argument('--no-open', action='store_true')
parser.add_argument('--dist', action='store_true')
parser.add_argument('--game', choices=['house09','floor13','desk'], default='house09')
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parent.parent
if args.dist:
    root /= 'dist'
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
with http.server.ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
    entry = {'house09':'', 'floor13':'floor13.html', 'desk':'desk.html'}[args.game]
    url = f'http://127.0.0.1:{server.server_port}/{entry}'
    print(f'Game: {url}', flush=True)
    print('Giữ cửa sổ này mở khi chơi. Nhấn Ctrl+C để dừng.', flush=True)
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nĐã đóng game.')
