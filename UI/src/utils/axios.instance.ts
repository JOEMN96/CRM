import axios from "axios";

const baseURL = "http://localhost:3001/";
const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import("next/headers"),
      token = cookies().get("access_token")?.value;
    if (token) {
      config.headers.Cookie = "access_token=" + token;
    }
  }
  return config;
});

// api.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         if (isServer) {
//           ("use server");
//           const { cookies } = await import("next/headers");
//           const referesh_token = cookies().get("refresh_token")?.value;

//           const token = "refresh_token=" + referesh_token;

//           console.log();

//           if (referesh_token) {
//             let res = await axios.get(baseURL + "auth/refresh", {
//               headers: {
//                 Cookie: token,
//               },
//             });

//             if (res.headers["set-cookie"]?.length) {
//               console.log(res.headers["set-cookie"][0].split(";")[0]);
//               originalRequest.headers.Cookie = res.headers["set-cookie"][0].split(";")[0];
//             }

//             return axios(originalRequest, originalRequest.config);
//           }
//         } else {
//           await axios.get(baseURL + "auth/refresh", { withCredentials: true });
//           return axios(originalRequest);
//         }
//         // throw new Error();
//       } catch (error) {
//         return Promise.reject(error);
//       }
//       return Promise.reject(error);
//     }
//   }
// );

export default api;
