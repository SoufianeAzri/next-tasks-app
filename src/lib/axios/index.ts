import axios from "axios";

// process.env.NEXT_PUBLIC_API_URL ||

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});


export default axiosInstance;