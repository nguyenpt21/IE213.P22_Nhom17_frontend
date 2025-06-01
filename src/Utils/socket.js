import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId, role) => {
    if (socket) return socket;

    socket = io("http://localhost:3000", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: { userId, role },
        withCredentials: true
    });
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};