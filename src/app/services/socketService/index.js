import io from "socket.io-client";

export const initiateSocketConnection = () => {
  // console.log(`Connecting socket...`);
  return io(process.env.REACT_APP_API);
};

export const disconnectSocket = (socket) => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};

