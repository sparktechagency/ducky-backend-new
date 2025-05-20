"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
        type: String,
        enum: ['stripe'],
        required: true,
        default: 'stripe',
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'Failed'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
    session_id: {
        type: String,
        default: null,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
}, { timestamps: true });
// paymentSchema.pre('validate', function (next) {
//   if (this.method === 'bank') {
//     if (
//       !this.bankDetails ||
//       !this.bankDetails.accountNumber ||
//       !this.bankDetails.accountName ||
//       !this.bankDetails.bankName
//     ) {
//       return next(new Error('Bank details are required for bank withdrawals.'));
//     }
//   } else if (this.method === 'paypal_pay') {
//     if (!this.paypalPayDetails || !this.paypalPayDetails.paypalId) {
//       return next(
//         new Error('GooglePay details are required for Google withdrawals.'),
//       );
//     }
//   } else if (this.method === 'apple_pay') {
//     if (!this.applePayDetails || !this.applePayDetails.appleId) {
//       return next(
//         new Error('ApplePay details are required for Apple withdrawals.'),
//       );
//     }
//   }
//   next();
// });
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
