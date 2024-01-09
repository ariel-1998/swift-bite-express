import { UserCredentials, UserRegisterForm } from "../models/User";
import { defaultAxios } from "../utils/axiosConfig";
import { CONSTANTS } from "../utils/constants";

export type Provider = "Google" | "Facebook";

class AuthService {
  providerAuth = (provider: Provider) => {
    return `${CONSTANTS.API_BASE_URL}/auth/${provider.toLowerCase()}`;
    // defaultAxios.get(`/auth/${provider.toLowerCase()}`);
  };

  localLogin = async (credentials: UserCredentials) => {
    await defaultAxios.post("/auth/local/login", credentials);
  };

  localRegistration = async (
    registratioData: Omit<UserRegisterForm, "confirmPassword">
  ) => {
    await defaultAxios.post("/auth/local/register", registratioData);
  };

  //   getLogin = () => {};
}

export const authService = new AuthService();
