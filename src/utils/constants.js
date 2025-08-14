
const isLocal = window.location.hostname === "localhost";

export const BASE_URL = isLocal
  ? import.meta.env.VITE_LOCAL_BASE_URL
  : import.meta.env.VITE_AWS_BASE_URL;
