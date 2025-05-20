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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_models_1 = require("../user/user.models");
const tokenManage_1 = require("../../utils/tokenManage");
const otp_utils_1 = require("../otp/otp.utils");
const otp_service_1 = require("../otp/otp.service");
const eamilNotifiacation_1 = require("../../utils/eamilNotifiacation");
const user_service_1 = require("../user/user.service");
// Login
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // console.log("payload", payload)
    const user = yield user_models_1.User.isUserActive(payload === null || payload === void 0 ? void 0 : payload.email);
    // console.log('user', user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (!(yield user_models_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password does not match');
    }
    const jwtPayload = {
        fullName: user === null || user === void 0 ? void 0 : user.fullName,
        email: user.email,
        userId: (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString(),
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    // console.log({ jwtPayload });
    const accessToken = (0, tokenManage_1.createToken)({
        payload: jwtPayload,
        access_secret: config_1.default.jwt_access_secret,
        expity_time: config_1.default.jwt_access_expires_in,
    });
    // console.log({ accessToken });
    const refreshToken = (0, tokenManage_1.createToken)({
        payload: jwtPayload,
        access_secret: config_1.default.jwt_refresh_secret,
        expity_time: config_1.default.jwt_refresh_expires_in,
    });
    return {
        user,
        accessToken,
        refreshToken,
    };
});
// forgot Password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.isUserActive(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const { isExist, isExpireOtp } = yield otp_service_1.otpServices.checkOtpByEmail(email);
    const { otp, expiredAt } = (0, otp_utils_1.generateOptAndExpireTime)();
    if (isExist && !isExpireOtp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'otp-exist. Check your email.');
    }
    else if (isExist && isExpireOtp) {
        const otpUpdateData = {
            otp,
            expiredAt,
            status: 'pending',
        };
        yield otp_service_1.otpServices.updateOtpByEmail(email, otpUpdateData);
    }
    else {
        const otpUpdateData = {
            name: '',
            sentTo: email,
            receiverType: 'email',
            purpose: 'forget-password',
            otp,
            expiredAt,
        };
        yield otp_service_1.otpServices.createOtp(otpUpdateData);
    }
    const jwtPayload = {
        email: email,
        userId: user === null || user === void 0 ? void 0 : user._id,
    };
    const forgetToken = (0, tokenManage_1.createToken)({
        payload: jwtPayload,
        access_secret: config_1.default.jwt_access_secret,
        expity_time: config_1.default.otp_token_expire_time,
    });
    process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, eamilNotifiacation_1.otpSendEmail)({
            sentTo: email,
            subject: 'Your one time otp for forget password',
            name: '',
            otp,
            expiredAt: expiredAt,
        });
    }));
    return { forgetToken };
});
// forgot  Password Otp Match
const forgotPasswordOtpMatch = (_a) => __awaiter(void 0, [_a], void 0, function* ({ otp, token, }) {
    // console.log({ otp, token });
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const decodeData = (0, tokenManage_1.verifyToken)({
        token,
        access_secret: config_1.default.jwt_access_secret,
    });
    if (!decodeData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You are not authorised');
    }
    const { email } = decodeData;
    const isOtpMatch = yield otp_service_1.otpServices.otpMatch(email, otp);
    if (!isOtpMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP did not match');
    }
    process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
        yield otp_service_1.otpServices.updateOtpByEmail(email, {
            status: 'verified',
        });
    }));
    const user = yield user_models_1.User.isUserActive(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const jwtPayload = {
        email: email,
        userId: user === null || user === void 0 ? void 0 : user._id,
    };
    const forgetOtpMatchToken = (0, tokenManage_1.createToken)({
        payload: jwtPayload,
        access_secret: config_1.default.jwt_access_secret,
        expity_time: config_1.default.otp_token_expire_time,
    });
    return { forgetOtpMatchToken };
});
// Reset password
const resetPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, newPassword, confirmPassword, }) {
    // console.log(newPassword, confirmPassword);
    if (newPassword !== confirmPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password does not match');
    }
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const decodeData = (0, tokenManage_1.verifyToken)({
        token,
        access_secret: config_1.default.jwt_access_secret,
    });
    if (!decodeData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You are not authorised');
    }
    const { email, userId } = decodeData;
    const user = yield user_models_1.User.isUserActive(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_service_1.userService.updateUser(userId, {
        password: hashedPassword,
    });
    return result;
});
// Change password
const changePassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, newPassword, oldPassword, }) {
    const user = yield user_models_1.User.IsUserExistById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!(yield user_models_1.User.isPasswordMatched(oldPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Old password does not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_service_1.userService.updateUser(userId, {
        password: hashedPassword,
    });
    return result;
});
// rest ..............................
// Forgot password
// Refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('token====', token);
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const decoded = (0, tokenManage_1.verifyToken)({
        token,
        access_secret: config_1.default.jwt_refresh_secret,
    });
    const { email } = decoded;
    const activeUser = yield user_models_1.User.isUserActive(email);
    if (!activeUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const jwtPayload = {
        fullName: activeUser === null || activeUser === void 0 ? void 0 : activeUser.fullName,
        email: activeUser.email,
        userId: (_a = activeUser === null || activeUser === void 0 ? void 0 : activeUser._id) === null || _a === void 0 ? void 0 : _a.toString(),
        role: activeUser === null || activeUser === void 0 ? void 0 : activeUser.role,
    };
    const accessToken = (0, tokenManage_1.createToken)({
        payload: jwtPayload,
        access_secret: config_1.default.jwt_access_secret,
        expity_time: config_1.default.jwt_access_expires_in,
    });
    return {
        accessToken,
    };
});
exports.authServices = {
    login,
    forgotPasswordOtpMatch,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
};
