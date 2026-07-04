#!/bin/bash
# TDD-Gate Hook: Blocks editing production code without corresponding test file
# Exit codes: 0 (pass), 2 (block)
# Event: PreToolUse on Edit|MultiEdit|Write
# Usage: Enable in settings.json hooks configuration

set +e  # Allow errors; we handle exit codes explicitly

# Read tool input from stdin (JSON format)
TOOL_INPUT=$(cat)
FILE_PATH=$(echo "$TOOL_INPUT" | grep -o '"file_path":"[^"]*' | cut -d'"' -f4)

# Define production code patterns
PROD_PATTERNS=(
  '\.cs$'      # C#
  '\.py$'      # Python
  '\.ts$'      # TypeScript
  '\.tsx$'     # TSX
  '\.js$'      # JavaScript
  '\.jsx$'     # JSX
  '\.go$'      # Go
  '\.rs$'      # Rust
  '\.rb$'      # Ruby
  '\.php$'     # PHP
  '\.java$'    # Java
  '\.kt$'      # Kotlin
  '\.swift$'   # Swift
  '\.dart$'    # Dart
)

# Define skip patterns (exclude from TDD check)
SKIP_PATTERNS=(
  '\.d\.ts$'           # TypeScript declarations
  '^Program\.cs$'      # Program entry point
  '^Startup\.cs$'      # Startup configuration
  '/migrations/'       # Database migrations
  '/config/'           # Config files
  '/fixtures/'         # Test fixtures
  '/mocks/'            # Test mocks
  '/test/'             # Test directory
  '/tests/'            # Tests directory
  '__tests__'          # Jest test directory
  '\.test\.'           # Test file
  '\.spec\.'           # Spec file
)

# Check if file matches production code pattern
IS_PROD=0
for pattern in "${PROD_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" =~ $pattern ]]; then
    IS_PROD=1
    break
  fi
done

# If not production code, allow edit
if [[ $IS_PROD -eq 0 ]]; then
  exit 0
fi

# Check if file should be skipped
for pattern in "${SKIP_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" =~ $pattern ]]; then
    exit 0
  fi
done

# Extract directory and filename
FILENAME=$(basename "$FILE_PATH")
DIRNAME=$(dirname "$FILE_PATH")

# Test file patterns to search for
TEST_PATTERNS=(
  "${FILENAME%.*}Test.${FILENAME##*.}"
  "${FILENAME%.*}.test.${FILENAME##*.}"
  "${FILENAME%.*}.spec.${FILENAME##*.}"
  "test_${FILENAME}"
  "Test${FILENAME}"
)

# Search for test file: sibling dir, ../test(s)/, __tests__, project-wide (max 3 levels up)
FOUND_TEST=0

# Check sibling directory
for pattern in "${TEST_PATTERNS[@]}"; do
  if [[ -f "$DIRNAME/$pattern" ]]; then
    FOUND_TEST=1
    break
  fi
done

# Check ../test and ../tests
if [[ $FOUND_TEST -eq 0 ]]; then
  for dir in "$DIRNAME/../test" "$DIRNAME/../tests"; do
    for pattern in "${TEST_PATTERNS[@]}"; do
      if [[ -f "$dir/$pattern" ]]; then
        FOUND_TEST=1
        break 2
      fi
    done
  done
fi

# Check __tests__ sibling
if [[ $FOUND_TEST -eq 0 ]]; then
  if [[ -f "$DIRNAME/__tests__/${FILENAME%.*}.test.${FILENAME##*.}" ]] || \
     [[ -f "$DIRNAME/__tests__/${FILENAME%.*}.spec.${FILENAME##*.}" ]]; then
    FOUND_TEST=1
  fi
fi

# Block if no test found
if [[ $FOUND_TEST -eq 0 ]]; then
  echo "TDD-GATE BLOCK: No test file found for $FILE_PATH" >&2
  echo "Create a test file matching patterns: ${TEST_PATTERNS[*]}" >&2
  echo "in: $DIRNAME, $DIRNAME/../test, $DIRNAME/../tests, or $DIRNAME/__tests__" >&2
  exit 2
fi

exit 0
