"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = exports.paymentSchema = void 0;
const zod_1 = require("zod");
const bankDetailsSchema = zod_1.z
    .object({
    accountNumber: zod_1.z.string().min(1, 'Account number is required.'),
    accountName: zod_1.z.string().min(1, 'Account name is required.'),
    bankName: zod_1.z.string().min(1, 'Bank name is required.'),
})
    .partial();
const paypalPayDetailsSchema = zod_1.z
    .object({
    paypalId: zod_1.z.string().min(1, 'PayPal ID is required.'),
})
    .partial();
const applePayDetailsSchema = zod_1.z
    .object({
    appleId: zod_1.z.string().min(1, 'Apple ID is required.'),
})
    .partial();
// Main Zod schema for withdrawal validation
exports.paymentSchema = zod_1.z.object({
    mentorId: zod_1.z.string().min(1, 'Mentor ID is required.'),
    amount: zod_1.z.number().positive('Amount must be a positive number.'),
    method: zod_1.z.enum(['bank', 'paypal_pay', 'apple_pay']),
    status: zod_1.z.enum(['pending', 'paid']).default('pending'),
    bankDetails: bankDetailsSchema.optional(),
    paypalPayDetails: paypalPayDetailsSchema.optional(),
    applePayDetails: applePayDetailsSchema.optional(),
    transactionId: zod_1.z.string().min(1, 'Transaction ID is required.'),
    transactionDate: zod_1.z.date().default(() => new Date()),
});
exports.paymentValidation = {
    paymentSchema: exports.paymentSchema,
};
