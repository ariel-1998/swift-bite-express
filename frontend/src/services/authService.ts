import { Role, User, UserCredentials, UserRegisterForm } from "../models/User";
import { credentialsAxios } from "../utils/axiosConfig";
import { CONSTANTS } from "../utils/constants";

export type Provider = "Google" | "Facebook";
export type Auth = "login" | "register";

class AuthService {
  providerAuth = (provider: Provider) => {
    return `${CONSTANTS.API_BASE_URL}/auth/${provider.toLowerCase()}`;
  };

  localLogin = async (credentials: UserCredentials) => {
    const { data } = await credentialsAxios.post<User>(
      "/auth/local/login",
      credentials
    );
    return data;
  };

  localRegistration = async (
    registratioData: Omit<UserRegisterForm, "confirmPassword">
  ) => {
    // registratioData.role = Role.user;
    const { data } = await credentialsAxios.post<User>(
      "/auth/local/register",
      registratioData
    );
    return data;
  };

  getLogin = async () => {
    const { data } = await credentialsAxios.get<User>("/auth/login");
    return data;
  };
  logout = async () => await credentialsAxios.post("/auth/logout");
}

export const authService = new AuthService();
