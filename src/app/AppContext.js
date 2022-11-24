import React from 'react';

import { initiateSocketConnection } from './services/socketService';

const AppContext = React.createContext({});

export const socket = initiateSocketConnection();
export const SocketContext = React.createContext();

export default AppContext;
