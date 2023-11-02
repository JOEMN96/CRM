import axios from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: "http://localhost:3001/",
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
//     console.log("failed");
//     const originalRequest = error.config;
//     // console.log(error);

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         await axios.post("/auth/refresh");
//         return axios(originalRequest);
//       } catch (error) {
//         // window.location.href = "/auth/signin";
//       }
//       return Promise.reject(error);
//     }
//   }
// );

export default api;
