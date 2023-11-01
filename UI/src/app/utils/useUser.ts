import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

function useUser() {
  const cookieStore = cookies();
  let accessToken: Cookie | undefined = cookieStore.get("access_token");

  let user: null | USER = null;
  if (isCookie(accessToken) && accessToken?.value) {
    user = jwtDecode(accessToken.value);
  }
  return user;
}

function isCookie(cookie: Cookie | undefined): cookie is Cookie {
  if (cookie === undefined) {
    return false;
  }
  return "value" in cookie;
}

export default useUser;
