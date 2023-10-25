import { setCookie, parseCookies } from "nookies";

const cookies = parseCookies();
export const token = cookies["access_token"];
