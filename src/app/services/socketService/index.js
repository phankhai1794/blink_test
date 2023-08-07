import io from "socket.io-client";

export const initiateSocketConnection = () => {
  return io(
    process.env.REACT_APP_SOCKET_HOST,
    {
      closeOnBeforeunload: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: Infinity
    }
  );
};