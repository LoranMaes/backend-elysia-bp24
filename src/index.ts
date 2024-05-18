import { Elysia } from "elysia";
import apiRoutes from "./routes/api";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";

const app = new Elysia();

// EXAMPLE: Using cors with regex
// .use(cors({
//   origin: /.*\.saltyaom\.com$/
// }))

app
  .use(rateLimit())
  .use(swagger())
  .use(cors())
  .group("api", (app) => app.use(apiRoutes))
  .onError(({ error, code, set }) => {
    set.status = 500;
    return "Internal Server Error";
  })
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${Bun.env.PORT || 3000}`
);
