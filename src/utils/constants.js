const isLocal = window.location.hostname === "localhost";

export const BASE_URL = isLocal
  ? "/api"   // dev -> use vite proxy
  : "/api";  // prod -> Nginx will forward /api to backend
