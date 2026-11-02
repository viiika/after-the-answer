#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  echo '需要已有 Python 3；也可直接双击 start.html。 / Python 3 is required, or open start.html directly.'
  exit 1
fi
printf '%s\n' '在浏览器打开 / Open: http://127.0.0.1:56607/v75/start.html' '关闭此窗口或按 Ctrl+C 停止。 / Close this window or press Ctrl+C to stop.'
python3 -m http.server 56607 --bind 127.0.0.1 --directory game
