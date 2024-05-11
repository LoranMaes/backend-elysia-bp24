import { Elysia } from "elysia";
import apiRoutes from "./routes/api";

const app = new Elysia();

app
  .group("api", (app) => app.use(apiRoutes))
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${Bun.env.PORT || 3000}`
);
