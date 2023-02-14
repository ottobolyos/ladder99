# TODO

All tasks that a fully implemented/done are simply removed from the list. If you want to know what was already done, check `git log`.

## TODO

- copy `.npmrc` (or run some `pnpm config` commands) in order to install peer deps using `pnpm` (or install using `npm i` without `.npmrc`) to `dist/{apps,libs}/*/` (each app/lib build folder);
  - or we could move all peerDeps to deps;
- create a WIP PR to upstream;
- [ ] add some dev docs:
  - [x] `index.md` (Home):
  - [ ] `development`:
    - [ ] `create-from-scratch.md`;
    - [ ] `changelog.md`:
      - [ ] TODO: This should be later moved to repo root, ideally using a tool to auto-generate the changelog.
    - [ ] `upgrade-deps.md`:
      - use `pnpm nx migrate latest` and `pnpm nx migrate $app@latest`;
      - consider creating a script to get all deps and devDeps from `package.json`, remove Nx packages, and run `nx migrate` commands;
    - [ ] `run-configs.md`:
      - [ ] describe Webstorm run configs
    - [ ] `api`:
      - [ ] `api.json`:
        - [ ] also create `api.md` where we would describe the file in a general way;
- `gateway-e2e`: consider using `@nestjs/config`;
- create `.dockerignore`;
- create `docker-compose.dev.yml`;
- create `docker-compose.prod.yml`;
- integrate database in Docker and use MikroORM;
- create error-handling interface;
- create `DatabaseModule`;
- create `InitAppService`:
- create `ExitAppService`:
  - when implemented, create an API endpoint and run it in `docs:api` script in `package.json` instead of killing the process;
  - it might be a good idea to move it (at least some portions, a function) to `shared` library, as exiting function will be needed in all microservices;

  ```ts
  // TODO: Create `ExitAppService`.
  // gateway.get(ExitAppService).subscribeToShutdown(() => gateway.close())
  ```

- create controllers, services (and possibly modules) for REST API and GraphQL API;
- create run configs in `.idea`:
  - run/debug the app locally;
  - run/debug the app in Docker;
  - Node remote debugging for the app run in Docker;
  - don’t forget to document all these run configs;
- integrate user auth’n, auth’z, session
- create tests for service methods;
- demonstrate a microservice that could scale:
  - we might want to use Redis to maintain the cached data;
- create some subscribable GQL endpoints running over MQTT;
- create a DB table to maintain the machine config which should be monitored;
- automatically start monitoring of all machines and of all features that are enabled according to the DB table;
- add `semver` to create releases:
  - consider using [this GitHub Action plugin](https://github.com/jefflinse/pr-semver-bump);
- create GitHub Actions actions to run `semver`, `commitlint`, `jest`, `eslint`, ??? `prettier`, running `pnpm docs:api` before merging anything to the default branch;
- ??? should we describe the NPM dependencies why they are required?
- describe scripts in `package.json`;
- add `orm:*` scripts in `package.json`;
- convert `docs/` to ReadTheDocs or something similar:
  - don’t forget to add some scripts to `package.json` to generate/update the docs;
- configure Conventional Changelog (e.g. `cz`/`cz-conventional-changelog`);
- add some keywords to `package.json`;
- add author (Mr IIoT) to `package.json`;
- add URL and repo URL to `package.json`;