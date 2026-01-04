import axios from "axios";

const isServer = typeof window === "undefined";

export const nextServer = axios.create({
  baseURL: isServer
    ? "https://notehub-api.goit.study"
    : (process.env.NEXT_PUBLIC_API_URL || "https://09-auth-brown-eight.vercel.app") + "/api",
  withCredentials: true,
});

export default nextServer;
