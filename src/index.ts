import { Elysia } from "elysia";
import apiRoutes from "./routes/api";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { csrfProtection } from "./middleware/middleware";

const app = new Elysia();

// EXAMPLE: Using cors with regex
// .use(cors({
//   origin: /.*\.saltyaom\.com$/
// }))

// ROUTE EXPLANATION
// use(rateLimit()) - This is a rate limiter middleware that will limit the number of requests
// use(swagger()) - This is for Swagger documentation
// use(cors()) - This is for CORS
// use(csrfProtection) - This is for CSRF protection

const allowedOrigin = "localhost:4173";

app
  // .use(rateLimit())
  .use(
    cors({
      origin: [Bun.env.FRONTEND_URL || allowedOrigin],
    })
  )
  .use(swagger())
  .use(csrfProtection)
  .use(apiRoutes)
  .onError(({ set }) => {
    set.status = 404;
    return "Not found";
  })
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${Bun.env.PORT || 3000}`
);
