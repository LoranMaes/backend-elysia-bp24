import { UserCreation } from "../models/user.model";

export default class AdminController {
  public async getUsers() {
    // Code to fetch users from database
  }

  public async getUser(id: number) {
    // Code to fetch user from database
  }

  public async createUser(user: UserCreation) {
    // Code to create user in database
  }

  public async deleteUser(id: number) {
    // Code to delete user from database
  }
}
