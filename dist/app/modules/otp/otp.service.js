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
exports.otpServices = void 0;
const otp_model_1 = __importDefault(require("./otp.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const tokenManage_1 = require("../../utils/tokenManage");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const otp_utils_1 = require("./otp.utils");
const eamilNotifiacation_1 = require("../../utils/eamilNotifiacation");
const createOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, sentTo, receiverType, purpose, otp, expiredAt, }) {
    // const expiredAtDate = new Date(expiredAt);
    const newOTP = new otp_model_1.default({
        sentTo,
        receiverType,
        purpose,
        otp,
        expiredAt,
    });
    yield newOTP.save();
    return newOTP;
});
const checkOtpByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield otp_model_1.default.findOne({
        sentTo: email,
    });
    // console.log({ email });
    // console.log({ isExist });
    const isExpireOtp = yield otp_model_1.default.findOne({
        sentTo: email,
        expiredAt: { $lt: new Date() }, // Use the `$gt` operator for comparison
    });
    // console.log({ isExpireOtp });
    // console.log('.........');
    return { isExist, isExpireOtp };
});
const otpMatch = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, otp);
    const isOtpMatch = yield otp_model_1.default.findOne({
        sentTo: email,
        otp,
        status: 'pending',
        expiredAt: { $gt: new Date() },
    });
    // console.log({ isOtpMatch });
    return isOtpMatch;
});
const updateOtpByEmail = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload);
    const otpUpdate = yield otp_model_1.default.findOneAndUpdate({
        sentTo: email,
    }, payload, { new: true });
    return otpUpdate;
});
const resendOtpEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token }) {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const decodeData = (0, tokenManage_1.verifyToken)({
        token,
        access_secret: config_1.default.jwt_access_secret,
    });
    const { email } = decodeData;
    const { isExist, isExpireOtp } = yield checkOtpByEmail(email);
    const { otp, expiredAt } = (0, otp_utils_1.generateOptAndExpireTime)();
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token data is not valid !!');
    }
    else if (isExist && !isExpireOtp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Otp exist. Please check email.');
    }
    else if (isExist && isExpireOtp) {
        const otpUpdateData = {
            otp,
            expiredAt,
        };
        yield updateOtpByEmail(email, otpUpdateData);
    }
    process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, eamilNotifiacation_1.otpSendEmail)({
            sentTo: email,
            subject: 'Re-send your one time otp for email  verification',
            name: '',
            otp,
            expiredAt: expiredAt,
        });
    }));
});
exports.otpServices = {
    createOtp,
    checkOtpByEmail,
    otpMatch,
    updateOtpByEmail,
    resendOtpEmail,
};
