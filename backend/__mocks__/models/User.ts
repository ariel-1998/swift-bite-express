import { Profile } from "passport-google-oauth20";
import { Credentials, Role, RegistrationData } from "../../src/models/User";

export const mockUser = {
  id: 1,
  authProviderId: "someId",
  email: "someEmail@gmail.com",
  fullName: "someName",
  role: Role.user,
  password: null,
  primaryAddressId: null,
};

export const mockProfile = {
  displayName: "someName",
  provider: "google",
  id: "123",
  _json: { email: "someEmail@gmail.com" },
} as Profile;

export const credentials: Credentials = {
  email: mockUser.email,
  password: "password",
};
export const registrationData: RegistrationData = {
  ...credentials,
  role: Role.user,
  fullName: "ariel",
};
