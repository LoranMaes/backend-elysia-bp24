import { Elysia } from "elysia";
import apiRoutes from "./routes/api";
import swagger from "@elysiajs/swagger";
import cors, { HTTPMethod } from "@elysiajs/cors";
import { csrfProtection } from "./middleware/middleware";
import { rateLimit } from "elysia-rate-limit";

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

const corsConfig = {
  origin: Bun.env.FRONTEND_URL || "localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
  allowedHeaders: "*",
  exposedHeaders: "*",
  maxAge: 5,
  credentials: true,
};

const swaggerConfig = {
  documentation: {
    info: {
      title: "ILVO - Time registration API",
      description: "API documentation for Elysia",
      version: "1.0.0",
    },
  },
};

app
  .use(
    rateLimit({
      max: 100,
    })
  )
  .use(cors(corsConfig))
  .use(swagger(swaggerConfig))
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
