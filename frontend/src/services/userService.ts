import { Role } from "../models/User";
import { credentialsAxios } from "../utils/axiosConfig";

const userRoute = "/user";
class UserService {
  async updateRole(role: Role) {
    console.log(role);
    await credentialsAxios.put(userRoute, { role });
  }
}

export const userService = new UserService();
