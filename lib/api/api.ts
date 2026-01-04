import axios from "axios";

const isServer = typeof window === "undefined";

export const nextServer = axios.create({
  baseURL: isServer
    ? "https://notehub-api.goit.study"
    : "/api",
  withCredentials: true,
});

export default nextServer;
