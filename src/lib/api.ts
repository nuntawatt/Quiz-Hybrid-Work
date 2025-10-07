import axios from "axios";
import { CIS_BASE_URL, CIS_API_KEY } from "./constants";
import { loadToken } from "./token";

export const cis = axios.create({ baseURL: CIS_BASE_URL, timeout: 15000 });

cis.interceptors.request.use(async (cfg) => {
  const jwt = await loadToken();
  if (jwt) cfg.headers.Authorization = `Bearer ${jwt}`;
  cfg.headers["x-api-key"] = CIS_API_KEY;
  cfg.headers.Accept = "application/json";
  return cfg;
});
