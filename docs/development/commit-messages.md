# Commit messages

Every commit message should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The configurations is located in [`commitlint.config.js`](/commitlint.config.js) (TODO: We should probably update `helpUrl` to this documentation.).

Currently, it is configured to accept the following types (first level) and scopes (second level; scope is always optional, i.e. it can be omitted, but when it is specified, it must be one from the list listed with a type; this list should not be trusted: always check the commit message using `commitlint` tool):

- `chore`:
  - description: ;
  - current scopes:
    - `build`;
    - `ci`;
    - `deps`;
- `docs`:
  - description: ;
  - scopes are all folder and file names located under `docs/`, with `.md` extensions removed from files;
  - current scopes:
    - `development`;
    - `index`;
- `feat`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
  - current scopes:
    - `gateway`;
    - `gateway|app`;
    - `gateway|assets`;
    - `gateway-e2e`;
    - `gateway-e2e|gateway`;
    - `gateway-e2e|support`;
- `fix`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
- `perf`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
- `refactor`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
- `revert`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
- `style`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`;
- `test`:
  - description: ;
  - scopes are all apps and libs names (folders under `apps/` and `libs/` folders) or apps/libs with a top-level module names separated with `|`.

## Check commit messages

I added `commit:lint` script to `package.json`, therefore one can run `pnpm commitlint <<< 'some commit message'` to check if the message is following Conventional Commits.

```bash
pnpm commitlint <<< 'some commit message'
# Exit code `1`
⧗   input: some commit message
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint


pnpm commitlint <<< 'fix(gw): some commit message'
⧗   input: fix(gw): some commit message
✖   scope must be one of [gateway, gateway|gateway, gateway|assets, gateway-e2e, gateway-e2e|gateway, gateway-e2e|support, development, index] [scope-enum]
✖   commit message with type "fix" may specify a scope, but if specified, it must be one of the following: "gateway", "gateway|app", "gateway|assets", "gateway-e2e", "gateway-e2e|gateway", "gateway-e2e|support" [selective-scope]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint


pnpm commitlint <<< 'fix(gateway): some commit message'
# No output, exit code `0`

```

## IDE plugins

One can use [JetBrains IDE plugin](https://plugins.jetbrains.com/plugin/14046-commitlint-conventional-commit) or [VSCode plugin](https://vivaxyblog.github.io/2020/04/29/vscode-conventional-commits-extension.html). These plugins provide some UI and validation into the IDE.

## GitLab Actions

We might want to create a GitHub Actions action (using [this plugin](https://github.com/wagoid/commitlint-github-action)) to automatically check the commit message on pull requests and pushes to the repository (at least to the default branch).
