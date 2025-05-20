"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const user_constants_1 = require("../user/user.constants");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes
    .post('/login', auth_controller_1.authControllers.login)
    .post('/refresh-token', 
// validateRequest(authValidation.refreshTokenValidationSchema),
auth_controller_1.authControllers.refreshToken)
    .post('/forgot-password-otp', (0, validateRequest_1.default)(auth_validation_1.authValidation.forgetPasswordValidationSchema), auth_controller_1.authControllers.forgotPassword)
    .patch('/change-password', (0, auth_1.default)(user_constants_1.USER_ROLE.USER, user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUB_ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), auth_controller_1.authControllers.changePassword)
    .patch('/forgot-password-otp-match', (0, validateRequest_1.default)(auth_validation_1.authValidation.otpMatchValidationSchema), auth_controller_1.authControllers.forgotPasswordOtpMatch)
    .patch('/forgot-password-reset', (0, validateRequest_1.default)(auth_validation_1.authValidation.resetPasswordValidationSchema), auth_controller_1.authControllers.resetPassword);
