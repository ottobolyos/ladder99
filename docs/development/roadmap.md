# Roadmap

- [ ] add some dev docs:
  - [x] `index.md` (Home):
  - [ ] `development`:
    - [x] `roadmap.md`:
      - This will always be a WIP.
    - [ ] `create_from_scratch.md`;
    - [ ] `changelog.md`:
      - [ ] TODO: This should be later moved to repo root, ideally using a tool to auto-generate the changelog.
    - [ ] `upgrade_deps.md`:
      - use `pnpm nx migrate latest` and `pnpm nx migrate $app@latest`;
      - consider creating a script to get all deps and devDeps from `package.json`, remove Nx packages, and run `nx migrate` commands;
    - [ ] `run_configs.md`:
      - [ ] describe Webstorm run configs
  - [ ] `api`:
    - [ ] `api.json`:
      - [ ] export from Insomnia;
