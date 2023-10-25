import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 15000,
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   function (response) {
//     console.log(response);
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
