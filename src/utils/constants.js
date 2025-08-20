const host = window.location.hostname;
const isLocal = host === "localhost" || host === "127.0.0.1";

export const BASE_URL = isLocal
  ? "http://localhost:3000/api" 
  : "/api"; 