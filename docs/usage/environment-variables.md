# Environment variables

Here is the list of all environment variables used by `@ladder99/gateway` along with their default values:

```dotenv
L99_ENABLE_SWAGGER=true
L99_GW_API_PREFIX=api
L99_GW_LOG_LEVEL=DEBUG
L99_GW_PORT=3333
```

Default `.env` path is set to `/ladder99/.env` (see [`apps/gateway/src/app/constant/default-config.constant.ts`](/apps/gateway/src/gateway/constant/default-config.constant.ts)). It can be overridden using `L99_CONFIG` variable.

You can define environment variables by exporting them in shell (it takes higher priority) or using the `.env` file.
