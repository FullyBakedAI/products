#!/bin/bash
# Run all QA fix batches in sequence with build check after each.
# Batches must run in order — later batches touch files already modified by earlier ones.
#
# Usage: cd /Users/Frank/products/Modulo && bash Spec/batches/run-batches.sh [START_BATCH]
# START_BATCH: optional letter (a-h) to start from mid-sequence, e.g. bash run-batches.sh c

set -e  # exit on error
REACT_DIR="/Users/Frank/products/Modulo/React"
SPEC_DIR="/Users/Frank/products/Modulo/Spec/batches"
START="${1:-a}"

run_batch() {
  local letter="$1"
  local file="$SPEC_DIR/batch-${letter}-*.md"
  local spec_file=$(ls $file 2>/dev/null | head -1)

  if [ -z "$spec_file" ]; then
    echo "  [SKIP] No spec file found for batch $letter"
    return 0
  fi

  echo ""
  echo "════════════════════════════════════════"
  echo "  BATCH ${letter^^} — $(basename $spec_file)"
  echo "════════════════════════════════════════"

  cd "$REACT_DIR"
  claude --model sonnet --dangerously-skip-permissions -p "$(cat $spec_file)" 2>&1

  echo ""
  echo "  → Running build check..."
  if npm run build 2>&1 | tail -5; then
    echo "  ✓ Build passed after batch ${letter^^}"
  else
    echo "  ✗ Build FAILED after batch ${letter^^} — stopping"
    exit 1
  fi
}

# Determine starting batch
BATCHES=(a b c d e f g h)
START_IDX=0
for i in "${!BATCHES[@]}"; do
  if [ "${BATCHES[$i]}" = "$START" ]; then
    START_IDX=$i
    break
  fi
done

echo "Starting from batch ${START^^} (index $START_IDX)"

for i in "${BATCHES[@]:$START_IDX}"; do
  run_batch "$i"
done

echo ""
echo "════════════════════════════════════════"
echo "  ALL BATCHES COMPLETE"
echo "════════════════════════════════════════"
