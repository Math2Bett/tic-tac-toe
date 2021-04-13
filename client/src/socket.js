import socketIOClient from 'socket.io-client'
const ENDPOINT = 'ws://localhost:4000';

let socket = null;

export const initializeSocketConection = () => {
    return getSocket();
}
export const getSocket = () => {
    if (socket) {
        return socket;
    }
    socket = socketIOClient(ENDPOINT);
    return socket;
}s
export const disconnectSocket = () => {
    socket.disconnect();
}
