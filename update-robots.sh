#!/usr/bin/env bash

set -euo pipefail

curl "https://api.darkvisitors.com/robots-txts" \
  -X POST \
  -H "Authorization: Bearer ${DARKVISITORS_TOKEN:?Error DARKVISITORS_TOKEN variable must be set}" \
  -H "Content-Type: application/json" \
  --data @darkvisitors.json \
  -o public/robots.txt

echo '' >> public/robots.txt
echo '' >> public/robots.txt
echo 'Sitemap: https://cosmicrose.dev/sitemap-index.xml' >> public/robots.txt
