import Elysia from "elysia";
import { UserService } from "../../services/user.service";
import { generalSchema } from "../routeValidators";

const catRoutes = new Elysia({ prefix: "/categories" });
const US = UserService;

catRoutes.model(generalSchema).get("/", () => {
  return {
    message: "Fetched categories successfully",
    data: US.getCategories(),
  };
});

export default catRoutes;
