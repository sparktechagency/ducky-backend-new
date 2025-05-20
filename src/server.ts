import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import socketIO from './socketio';
import { Server as SocketIOServer } from 'socket.io'; 
import colors from 'colors';
import config from './app/config';

let server: Server;
const socketServer = createServer();

const io: SocketIOServer = new SocketIOServer(socketServer, {
  cors: {
    origin: '*',
  },
});

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(Number(config.port), () => {
      console.log(
        colors.green(`App is listening on ${config.ip}:${config.port}`).bold,
      );
    });

    socketServer.listen(config.socket_port || 6000, () => {
      console.log(
        colors.yellow(
          `Socket is listening on ${config.ip}:${config.socket_port}`,
        ).bold,
      );
    });

    socketIO(io);
    global.io = io;
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1); 
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught exception detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
