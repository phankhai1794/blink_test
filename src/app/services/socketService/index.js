import io from "socket.io-client";

export const initiateSocketConnection = () => {
  console.log(`Connecting socket at: ${process.env.REACT_APP_SOCKET_URI}`);
  return io(process.env.REACT_APP_SOCKET_URI);
};

export const disconnectSocket = (socket) => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
