"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model, models } = mongoose_1.default;
const chatSchema = new Schema({
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
    ],
    status: {
        type: String,
        enum: ['accepted', 'blocked'],
        default: 'accepted',
    },
}, {
    timestamps: true,
});
// Check if the model is already defined to avoid OverwriteModelError
const Chat = model('Chat', chatSchema);
exports.default = Chat;
