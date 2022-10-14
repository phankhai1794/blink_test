import io from "socket.io-client";

export const initiateSocketConnection = () => {
  console.log(`Connecting socket at: ${window.location.origin}`);
  return io(window.location.origin);
};

export const disconnectSocket = (socket) => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
