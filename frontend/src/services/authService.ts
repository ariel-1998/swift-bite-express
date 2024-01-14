import { User, UserCredentials, UserRegisterForm } from "../models/User";
import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";
import { CONSTANTS } from "../utils/constants";

export type Provider = "Google" | "Facebook";
export type Auth = "login" | "register";

class AuthService {
  providerAuth = (provider: Provider, auth: Auth) => {
    return `${CONSTANTS.API_BASE_URL}/auth/${auth}/${provider.toLowerCase()}`;
  };

  localLogin = async (credentials: UserCredentials) => {
    const { data } = await defaultAxios.post<User>(
      "/auth/local/login",
      credentials
    );
    return data;
  };

  localRegistration = async (
    registratioData: Omit<UserRegisterForm, "confirmPassword">
  ) => {
    const { data } = await defaultAxios.post<User>(
      "/auth/local/register",
      registratioData
    );
    return data;
  };

  getLogin = async () => {
    const { data } = await credentialsAxios.get<User>("/auth/login");
    return data;
  };
}

export const authService = new AuthService();