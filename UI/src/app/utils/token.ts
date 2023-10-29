import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

const cookies = parseCookies();
let token = cookies["access_token"];

if (token) {
  token = jwtDecode(token);
}
export default token;
