"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(1, { message: 'Full name is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email format' }),
        password: zod_1.z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' }),
        // phone: z
        //   .string()
        //   .min(10, { message: 'Phone number must be at least 10 digits' }),
        image: zod_1.z.string().optional(),
    }),
});
exports.userValidation = {
    userValidationSchema,
};
