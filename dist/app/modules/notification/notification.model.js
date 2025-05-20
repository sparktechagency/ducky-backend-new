"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema
const NotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'User', // Reference to User model
    },
    message: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: false,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'cancel'],
        default: 'pending',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Create and export the model
const Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = Notification;
