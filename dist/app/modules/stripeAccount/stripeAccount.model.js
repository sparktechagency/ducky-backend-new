"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAccount = void 0;
const mongoose_1 = require("mongoose");
const stripeAccountSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id is required'],
    },
    accountId: {
        type: String,
        required: [true, 'account id is required'],
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
exports.StripeAccount = (0, mongoose_1.model)('StripeAccount', stripeAccountSchema);
