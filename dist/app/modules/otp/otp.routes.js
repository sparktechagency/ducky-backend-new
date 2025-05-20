"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
exports.otpRoutes = (0, express_1.Router)();
exports.otpRoutes.patch('/resend-otp', otp_controller_1.otpControllers.resendOtp);
