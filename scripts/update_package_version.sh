#!/usr/bin/env bash

# Update `version` in all app-level `package.json` files under `dist/` folder to be the same as the version in the root-level `package.json`.

repo_root="$(dirname "$(dirname "$0")")"
version="$(node -p "require('$repo_root/package.json').version")"

# Find all generated `package.json` files and update `version` in them
find "$repo_root/dist" -name package.json -not -path '*/node_modules/*' -exec sh -c "
  echo \"\$(jq -S --arg version '$version' '.version = \$version' \"\$1\")\" > \"\$1\"
" sh {} \;