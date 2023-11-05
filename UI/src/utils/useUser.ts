import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";

function useUser(access_tokenFromServer?: string) {
  if (access_tokenFromServer) {
    return jwtDecode(access_tokenFromServer);
  }

  const cookies = parseCookies();
  const accessToken: string | undefined = cookies["access_token"];

  let user: undefined | USER = undefined;
  if (accessToken) {
    user = jwtDecode(accessToken);
  }
  return user;
}

export default useUser;
