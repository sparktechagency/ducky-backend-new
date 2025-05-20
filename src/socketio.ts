import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { handleChatEvents } from './app/modules/socket/events/chatEvents';
import { handleMessageEvents } from './app/modules/socket/events/messageEvents';

const socketIO = (io: Server) => {
  // Initialize an object to store the active users
  const userSocketMap: Record<string, string> = {};
  const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
  };

  // On new socket connection
  io.on('connection', (socket: Socket) => {
    try {


      // Handle 'add-new-chat' event
      socket.on('add-new-chat', (data, callback) =>
        handleChatEvents(socket, data, callback),
      );
      // Handle other events, like 'add-new-message'
      socket.on('add-new-message', (data, callback) =>
        handleMessageEvents(socket, data, callback, io),
      );

    } catch (error) {
      console.error('Error in socket connection:', error);
    }
  });
};

export default socketIO;
