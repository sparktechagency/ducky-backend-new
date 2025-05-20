"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOptAndExpireTime = void 0;
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const generateOptAndExpireTime = () => {
    const otp = (0, otpGenerator_1.generateOtp)();
    const otpExpiryTime = parseInt(config_1.default.otp_expire_time) || 2;
    const expiredAt = (0, moment_1.default)().add(otpExpiryTime, 'minute').toISOString();
    return {
        otp,
        expiredAt,
    };
};
exports.generateOptAndExpireTime = generateOptAndExpireTime;
