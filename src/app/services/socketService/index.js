import io from "socket.io-client";

export const initiateSocketConnection = () => {
  const hostSocket = window.location.origin; // Replace with localhost api when running in local environment
  console.log(`Connecting socket at: ${hostSocket}`);
  return io(hostSocket);
};