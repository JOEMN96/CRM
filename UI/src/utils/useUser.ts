import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

function useUser(access_tokenFromServer?: string): null | undefined | USER {
  if (access_tokenFromServer) {
    return jwtDecode(access_tokenFromServer);
  }

  const cookies = parseCookies();
  const accessToken: string | undefined = cookies["access_token"];

  let user: undefined | USER | null = null;
  if (accessToken) {
    user = jwtDecode(accessToken);
  }
  return user;
}

export default useUser;
