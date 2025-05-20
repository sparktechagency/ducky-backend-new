"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const ProductLishSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Product' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
const historyEntrySchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    date: { type: Date, required: false, },
});
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    productList: { type: [ProductLishSchema], required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    status: {
        type: String,
        required: true,
        enum: [
            'pending',
            'completed',
            'received',
            'ongoing',
            'delivery',
            'finished',
            'cancelled',
        ],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    phone_number: { type: String, required: true },
    zip_code: { type: String, required: true },
    street_name: { type: String, required: true },
    state_code: { type: String, required: true },
    locality: { type: String, required: true },
    house_number: { type: String, required: true },
    given_name: { type: String, required: true },
    family_name: { type: String, required: true },
    country: { type: String, required: true },
    business: { type: String, required: true },
    address2: { type: String, required: true },
    history: {
        type: [historyEntrySchema],
        required: false,
    },
}, { timestamps: true });
const Order = (0, mongoose_1.model)('Order', OrderSchema);
exports.Order = Order;
