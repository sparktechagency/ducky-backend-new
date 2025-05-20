"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketVerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketVerifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        // Check if secret is undefined or empty
        if (!secret) {
            reject(new Error('JWT secret is not defined.'));
        }
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err); // Reject with error if JWT is invalid
            }
            else {
                resolve(decoded); // Resolve with decoded token if valid
            }
        });
    });
};
exports.socketVerifyToken = socketVerifyToken;
