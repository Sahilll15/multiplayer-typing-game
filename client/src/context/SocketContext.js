import React, { createContext, useContext } from 'react'
import io from 'socket.io-client';


const SocketContext = createContext(null);


const useSocket = () => {
    return useContext(SocketContext);
}


const SocketProvider = ({ children }) => {

    const socket = io('https://multiplayer-game-63zq.onrender.com');

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}


export { SocketProvider, useSocket }
