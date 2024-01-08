import axios from "axios";
import { CONSTANTS } from "./constants";

export const defaultAxios = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
});

export const credentialsAxios = axios.create({
  withCredentials: true,
  baseURL: CONSTANTS.API_BASE_URL,
});
