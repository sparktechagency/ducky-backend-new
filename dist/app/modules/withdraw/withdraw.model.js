"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = void 0;
const mongoose_1 = require("mongoose");
const WithdrawSchema = new mongoose_1.Schema({
    businessId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
    },
    transactionId: { type: String, required: true, unique: true },
    transactionDate: { type: Date, default: Date.now },
    destination: { type: String, required: true },
}, { timestamps: true });
exports.Withdraw = (0, mongoose_1.model)('Withdraw', WithdrawSchema);
