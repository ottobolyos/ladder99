#!/usr/bin/env bash

# Upgrade all dependencies

# Note: This upgrade script is quite slow (`nx migrate` takes some time to check everything), but I haven't had any issues with it. We might want to update this script use a different method.

# Note: This script depends on the following programs:
# - `pnpm`;
# - [npm] `nx`;
# - `jq`;
# - `grep`;
# - `dirname`, `ls`, `realpath`, `rm` from `coreutils`.

repo_root="$(realpath "$(dirname "$(dirname "$0")")")"

# Upgrade Nx packages
echo 'Migrating Nx packages ...'
pnpm nx migrate latest

# Upgrade dependencies and dev dependencies
# TODO: When `ts-jest` is updated, update also `@types/jest` and `jest` to the same version.
for p in $(jq -r '.dependencies + .devDependencies | to_entries[] | [.key][]' "$repo_root/package.json" | grep -v '^nx$\|^@nrwl/.*$'); do
	echo "Migrating '$p@latest' ..."
  pnpm nx migrate "$p@latest"
done

# Running migrations if there are any
if [ -f "$repo_root/migrations.json" ]; then
	pnpm nx migrate --run-migrations
	rm "$repo_root/migrations.json"
fi

# Consider checking `package.json` if the changes make sense; if yes, install the updated dependencies
pnpm i --no-frozen-lockfile

# We might want to keep `package.json` up-to-date.
# TODO: There is an error with this command.
# npm i --package-lock