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
exports.authControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const http_status_1 = __importDefault(require("http-status"));
// login
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authServices.login(req.body);
    const cookieOptions = {
        secure: false,
        httpOnly: true,
        maxAge: 31536000000,
    };
    if (config_1.default.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none';
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged in successfully',
        data: result,
    });
}));
// change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req === null || req === void 0 ? void 0 : req.user;
    const { newPassword, oldPassword } = req.body;
    const result = yield auth_service_1.authServices.changePassword({
        userId,
        newPassword,
        oldPassword,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password changed successfully',
        data: result,
    });
}));
// forgot password
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // // console.log("email");
    // // console.log(req?.body?.email);
    const { email } = req.body;
    const result = yield auth_service_1.authServices.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'An OTP sent to your email!',
        data: result,
    });
}));
// forgot password
const forgotPasswordOtpMatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.token;
    const { otp } = req.body;
    const result = yield auth_service_1.authServices.forgotPasswordOtpMatch({ otp, token });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Otp match successfully',
        data: result,
    });
}));
// reset password
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.token;
    const { newPassword, confirmPassword } = req.body;
    // console.log(newPassword, confirmPassword);
    const result = yield auth_service_1.authServices.resetPassword({
        token,
        newPassword,
        confirmPassword,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset successfully',
        data: result,
    });
}));
// refresh token
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('refresh token hit');
    const refreshToken = req.headers.refreshtoken;
    const result = yield auth_service_1.authServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token retrieved successfully',
        data: result,
    });
}));
exports.authControllers = {
    login,
    changePassword,
    forgotPassword,
    forgotPasswordOtpMatch,
    resetPassword,
    refreshToken,
};
