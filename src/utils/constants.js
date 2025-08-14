const host = window.location.hostname;
const isLocal = host === "localhost" || host === "127.0.0.1";

export const BASE_URL = isLocal
  ? "http://localhost:3000"        // local dev
  : "http://13.53.90.173:3000";    // EC2 backend
