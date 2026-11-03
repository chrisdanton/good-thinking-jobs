#!/bin/bash
# Weekly GOOD INDEX refresh (runs Monday mornings via launchd: com.goodthinking.goodindex).
# The Sunday 10pm LinkedIn job adds each new letter to linkedin/search.db; this rebuilds
# the GOOD INDEX passages from it and uploads them to the PRIVATE Supabase bucket the
# website reads. Nothing is committed to git (the letters are mostly paid).
set -euo pipefail
cd "$(dirname "$0")/.."
echo "── $(date) ──"
/usr/bin/python3 scripts/refresh-substack-archive.py
/usr/bin/python3 scripts/build-good-index.py
set -a; source .env.local; set +a
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "$SUPABASE_URL/storage/v1/object/good-index/passages.json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" -H "x-upsert: true" \
  --data-binary @src/data/good-index/passages.json)
echo "upload: HTTP $code"
[ "$code" = "200" ]
