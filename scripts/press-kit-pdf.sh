#!/bin/bash
# Prints the press kit print layout (/speaking/press-kit/pdf) to the PDF that
# the press kit page offers for download. Needs the dev server running on 3001:
#   npm run dev -- -p 3001
#   npm run presskit:pdf
set -e
cd "$(dirname "$0")/.."
OUT="public/speaking/good-thinking-press-kit.pdf"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" \
  "http://localhost:3001/speaking/press-kit/pdf"
echo "Saved $OUT"
