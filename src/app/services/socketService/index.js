import io from "socket.io-client";

export const initiateSocketConnection = () => {
  return io(process.env.REACT_APP_SOCKET_HOST);
};