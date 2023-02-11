# TODO

All tasks that a fully implemented/done are simply removed from the list. If you want to know what was already done, check `git log`.

- create a WIP PR to upstream;
- create `docs/development/create_from_scratch.sh`;
- configure ESLint;
- configure `.editorconfig`;
- configure `jest` (it might not require configuration;
- use Swagger/OpenAPI;
- configure the app in [`/apps/gateway/src/main.ts`](/apps/gateway/src/main.ts);
- configure `gw/project.json` (incl. creation of app-level `package.json` and remove `assets` folder);
- replace `express` with `fastify`;
- create `.dockerignore`;
- create `docker-compose.dev.yml`;
- create `docker-compose.prod.yml`;
- integrate database in Docker and use MikroORM;
- create error-handling interface;
- create `DatabaseModule`;
- create `InitAppService`:
- create `ExitAppService`:
   - it might be a good idea to move it (at least some portions, a function) to `shared` library, as exiting function will be needed in all microservices;
- define `.env` and create `.env.example`;
- create controllers, services (and possibly modules) for REST API and GraphQL API;
- crate run configs in `.idea`:
   - run/debug the app locally;
   - run/debug the app in Docker;
   - Node remote debugging for the app run in Docker;
- integrate user auth’n, auth’z, session
- create tests for service methods;
- demonstrate a microservice that could scale:
   - we might want to use Redis to maintain the cached data;
- create some subscribable GQL endpoints running over MQTT;
- create a DB table to maintain the machine config which should be monitored;
- automatically start monitoring of all machines and of all features that are enabled according to the DB table;
- add `semver` to create releases;
- create GitHub Actions actions to run `commitlint`, `jest`, `eslint`, ??? `prettier`;