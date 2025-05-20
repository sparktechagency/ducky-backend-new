"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const socketio_1 = __importDefault(require("./socketio"));
const socket_io_1 = require("socket.io");
const colors_1 = __importDefault(require("colors"));
const config_1 = __importDefault(require("./app/config"));
let server;
const socketServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(socketServer, {
    cors: {
        origin: '*',
    },
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            server = app_1.default.listen(Number(config_1.default.port), () => {
                console.log(colors_1.default.green(`App is listening on ${config_1.default.ip}:${config_1.default.port}`).bold);
            });
            socketServer.listen(config_1.default.socket_port || 6000, () => {
                console.log(colors_1.default.yellow(`Socket is listening on ${config_1.default.ip}:${config_1.default.socket_port}`).bold);
            });
            (0, socketio_1.default)(io);
            global.io = io;
        }
        catch (err) {
            console.error('Error starting the server:', err);
            process.exit(1);
        }
    });
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
