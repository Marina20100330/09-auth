// app/api/api.ts
import axios from "axios";

export const api = axios.create({ 
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "https://09-auth-six-navy.vercel.app") +
    "/api",
  withCredentials: true,
});
