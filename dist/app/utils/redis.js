"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const client = redis_1.default.createClient({
    url: "redis://localhost:6379"
});
client.on('error', (err) => console.log('Redis Client Error', err));
exports.default = client;
