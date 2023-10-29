import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

function useUser() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("access_token");
  let user: undefined | USER = undefined;
  if (accessToken) {
    user = jwtDecode(accessToken.value);
  }
  return user;
}

export default useUser;
