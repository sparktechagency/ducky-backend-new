"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model, models } = mongoose_1.default;
const messageSchema = new Schema({
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    message: { type: String, required: false },
    type: {
        type: String,
        enum: ['general', 'special', 'reply'],
        default: 'general',
    },
    link: { type: String, required: false },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const Message = model('Message', messageSchema);
exports.default = Message;
