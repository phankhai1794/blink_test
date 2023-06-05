import io from "socket.io-client";

export const initiateSocketConnection = () => {
  return io(window.location.origin);
};