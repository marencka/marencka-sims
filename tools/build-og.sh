#!/usr/bin/env bash
# Renders the share card and the iOS touch icon from the site's own boot screen.
#   assets/og.png                1200x630, used by og:image / twitter:image
#   assets/apple-touch-icon.png   180x180, iOS home screen
# Re-run this whenever the boot screen changes: tools/build-og.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$chrome" ] || { echo "Chrome not found at $chrome" >&2; exit 1; }

profile="$(mktemp -d)"
trap 'rm -rf "$profile"' EXIT

shot() { # shot <source.html> <width> <height> <out.png>
  rm -f "$4"
  # Headless Chrome writes the screenshot but does not always exit, so it runs
  # detached and gets reaped once the file appears.
  "$chrome" --headless --disable-gpu --hide-scrollbars --no-first-run \
    --force-device-scale-factor=1 --virtual-time-budget=3000 \
    --user-data-dir="$profile/$(basename "$1")" --window-size="$2,$3" \
    --screenshot="$4" "file://$1" >/dev/null 2>&1 &
  local pid=$! i=0
  while [ ! -s "$4" ] && [ $i -lt 60 ]; do sleep 0.5; i=$((i + 1)); done
  sleep 1
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [ -s "$4" ] || { echo "failed to render $4" >&2; return 1; }
  echo "$(basename "$4")  $(du -h "$4" | cut -f1)  $(sips -g pixelWidth -g pixelHeight "$4" | awk '/pixel/{printf "%s ", $2}')"
}

shot "$root/tools/og-card.html" 1200 630 "$root/assets/og.png"
# Chrome will not render a 180px window, so the icon is shot large and resized.
shot "$root/tools/og-icon.html" 512 512 "$root/assets/apple-touch-icon.png"
sips -z 180 180 "$root/assets/apple-touch-icon.png" >/dev/null
echo "apple-touch-icon.png resized to 180x180"
