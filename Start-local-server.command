#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  echo 'Python 3 is required. You can also open start.html directly.'
  exit 1
fi
printf '%s\n' 'Open in your browser: http://127.0.0.1:56607/v75/start.html?lang=en' 'Close this window or press Ctrl+C to stop.'
python3 -m http.server 56607 --bind 127.0.0.1 --directory game
