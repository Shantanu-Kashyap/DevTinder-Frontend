import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return io(BASE_URL);
  } else {
    return io(); 
  }
};