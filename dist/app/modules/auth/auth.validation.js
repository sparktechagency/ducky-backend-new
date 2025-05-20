"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const loginZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required!',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required!',
        }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required!',
        }),
    }),
});
const otpMatchValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z.string({
            required_error: 'Otp is required!',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({
            required_error: 'New Password is required!',
        }),
        confirmPassword: zod_1.z.string({
            required_error: 'New Password is required!',
        }),
    }),
});
exports.authValidation = {
    loginZodValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    otpMatchValidationSchema,
    resetPasswordValidationSchema,
};
