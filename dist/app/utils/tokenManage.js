"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createToken = ({ payload, access_secret, expity_time, }) => {
    const token = jsonwebtoken_1.default.sign(payload, access_secret, {
        expiresIn: expity_time,
    });
    return token;
};
exports.createToken = createToken;
const verifyToken = ({ token, access_secret, }) => {
    try {
        return jsonwebtoken_1.default.verify(token, access_secret);
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized!');
    }
};
exports.verifyToken = verifyToken;
