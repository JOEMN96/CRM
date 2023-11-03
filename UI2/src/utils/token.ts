import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";

const cookies = parseCookies();
let token = cookies["access_token"];

if (token) {
  token = jwtDecode(token);
}
export default token;
