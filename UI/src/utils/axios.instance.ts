import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Router from "next/router";

const baseURL = process.env.BASEURL;

const isServer = typeof window === "undefined";
let context = <GetServerSidePropsContext>{};

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//  For next.js server side execution {Servers don't have access to cookies} so we are attaching cookie with req
api.interceptors.request.use(async (config) => {
  if (isServer && context?.req?.cookies?.access_token) {
    const token = context.req.cookies.access_token;
    if (token) {
      config.headers.Cookie = "access_token=" + token;
    }
  }
  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    //  To fetch access token when it was expired
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //  For next.js SSR
        if (isServer && context?.req?.cookies?.refresh_token) {
          const token = context?.req?.cookies?.refresh_token;

          if (token) {
            let res = await axios.get(baseURL + "auth/refresh", {
              headers: {
                Cookie: "refresh_token=" + token,
              },
            });

            context.res.setHeader("set-cookie", res.headers["set-cookie"] as string[]);
            originalRequest.headers.Cookie = res.headers["set-cookie"];
            return axios(originalRequest);
          }
        } else {
          //  For Browser
          await axios.get(baseURL + "auth/refresh", { withCredentials: true });
          return axios(originalRequest);
        }
      } catch (error) {
        if (isServer) {
          context.res.setHeader("location", "/auth/signin");
          context.res.statusCode = 302;
          context.res.end();
        } else {
          Router.push("/auth/signin");
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { api };
