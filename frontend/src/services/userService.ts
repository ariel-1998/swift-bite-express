import { Role } from "../models/User";
import { credentialsAxios } from "../utils/axiosConfig";

const userRoute = "/user";
class UserService {
  async updateRole(role: Role) {
    await credentialsAxios.put(userRoute, role);
  }
}

export const userService = new UserService();
