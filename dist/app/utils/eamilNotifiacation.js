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
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpSendEmail = void 0;
const mailSender_1 = require("./mailSender");
const otpSendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sentTo, subject, name, otp, expiredAt, }) {
    // console.log({ sentTo , otp});
    yield (0, mailSender_1.sendEmail)(sentTo, subject, `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
       <h1>Hello dear, ${name}</h1>
      <h2 style="color: #4CAF50;">Your One Time OTP</h2>
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
        <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
        <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiredAt.toLocaleString()}</p>
      </div>
    </div>`);
});
exports.otpSendEmail = otpSendEmail;
