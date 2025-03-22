import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
