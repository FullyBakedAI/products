#!/usr/bin/env bash
set -euo pipefail

SRC="$(dirname "$0")/../src"
ERRORS=0

echo "=== BakeKit Quality Gate ==="
echo ""

# 1. Hardcoded #fff / #000 / hex in product CSS
echo "--- Checking CSS for hardcoded hex colours ---"
HITS=$(grep -rn 'color: #\|background: #\|border.*: #' --include='*.css' \
  --exclude-dir=ds --exclude-dir=theme --exclude-dir=v1 "$SRC" \
  | grep -v design-system-page \
  | grep -v tokens.css \
  | grep -v node_modules \
  || true)

if [ -n "$HITS" ]; then
  echo "FAIL: Hardcoded hex colours found in product CSS:"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi
echo ""

# 2. Hardcoded rgba() in product CSS (outside tokens.css, excluding box-shadow)
echo "--- Checking CSS for hardcoded rgba() (non-shadow) ---"
HITS=$(grep -rn 'rgba(' --include='*.css' \
  --exclude-dir=ds --exclude-dir=theme --exclude-dir=v1 "$SRC" \
  | grep -v design-system-page \
  | grep -v tokens.css \
  | grep -v node_modules \
  | grep -v 'var(' \
  | grep -v 'box-shadow' \
  | grep -v 'color-mix' \
  || true)

if [ -n "$HITS" ]; then
  echo "WARN: Hardcoded rgba() found (review these):"
  echo "$HITS"
else
  echo "PASS"
fi
echo ""

# 3. Context/Config providers missing useMemo on provider value
echo "--- Checking contexts for useMemo on provider value ---"
CTX_PASS=true
while IFS= read -r ctx; do
  [ -f "$ctx" ] || continue
  if grep -q 'Provider' "$ctx" && ! grep -q 'useMemo' "$ctx"; then
    echo "FAIL: $(basename "$ctx") — provider value not wrapped in useMemo"
    ERRORS=$((ERRORS + 1))
    CTX_PASS=false
  fi
done < <(find "$SRC" -type f \( -name '*Context*.jsx' -o -name '*Context*.tsx' -o -name '*Config*.jsx' -o -name '*Config*.tsx' \) ! -name '*.test.*' ! -name '*.spec.*')
if $CTX_PASS; then echo "PASS (all contexts checked)"; fi
echo ""

# 4. Check for `color: #fff` specifically (most common violation)
echo "--- Checking for color: #fff anywhere in product code ---"
HITS=$(grep -rn 'color: #fff' --include='*.css' --include='*.jsx' \
  --exclude-dir=ds --exclude-dir=theme --exclude-dir=v1 "$SRC" \
  | grep -v design-system-page \
  | grep -v tokens.css \
  | grep -v node_modules \
  || true)

if [ -n "$HITS" ]; then
  echo "FAIL: Raw #fff found — use var(--bk-text-on-brand):"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi
echo ""

# Summary
echo "==========================="
if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS violation(s) found. Fix before committing."
  exit 1
else
  echo "ALL CHECKS PASSED"
  exit 0
fi
