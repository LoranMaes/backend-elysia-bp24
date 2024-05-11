import swagger from "@elysiajs/swagger";
import { PrismaClient } from "@prisma/client";
import Elysia from "elysia";

const apiRoutes = new Elysia();

apiRoutes
  .use(swagger())
  .get("/", async () => await new PrismaClient().user.count());

export default apiRoutes;
