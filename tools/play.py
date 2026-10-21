#!/usr/bin/env python3
"""Serve TẦNG 13 locally. Standard library only; no install step."""
import argparse
import functools
import http.server
import pathlib
import webbrowser

parser = argparse.ArgumentParser(description='Mở TẦNG 13 trên máy này')
parser.add_argument('--port', type=int, default=0)
parser.add_argument('--no-open', action='store_true')
parser.add_argument('--dist', action='store_true')
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parent.parent
if args.dist:
    root /= 'dist'
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
with http.server.ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
    url = f'http://127.0.0.1:{server.server_port}/'
    print(f'TẦNG 13: {url}', flush=True)
    print('Giữ cửa sổ này mở khi chơi. Nhấn Ctrl+C để dừng.', flush=True)
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nĐã đóng game.')
