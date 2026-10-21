#!/bin/zsh
cd -- "$(dirname -- "$0")"
exec python3 tools/play.py --game floor13
