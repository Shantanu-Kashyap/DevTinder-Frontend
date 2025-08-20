import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = (options) => {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return io("http://localhost:3000", options); 
  } else {
    return io(options); 
  }
};