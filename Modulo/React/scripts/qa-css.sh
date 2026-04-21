#!/usr/bin/env bash
# QA check: detect hardcoded hex colours and rgba(255,...) in CSS/JSX source
set -euo pipefail

RESULT=$(grep -rn 'color: #\|background: #\|rgba(255' src/ --include="*.css" --include="*.jsx" --exclude="tokens.css" 2>/dev/null || true)

if [ -n "$RESULT" ]; then
  echo "CSS QA FAILED — hardcoded values found:"
  echo "$RESULT"
  exit 1
else
  echo "CSS QA: clean"
fi
