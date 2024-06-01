import Elysia from "elysia";
import { UserService } from "../../services/user.service";
import { generalSchema } from "../routeValidators";

const catRoutes = new Elysia({ prefix: "/categories" });
const US = UserService;

catRoutes.model(generalSchema).get("/", async ({ cookie: { auth_session } }) => {
  return {
    message: "Fetched categories successfully",
    data: await US.getCategories(auth_session.value),
  };
});

export default catRoutes;
