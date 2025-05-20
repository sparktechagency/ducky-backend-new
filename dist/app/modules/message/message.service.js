"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const message_model_1 = __importDefault(require("./message.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
// Add a new message
const addMessage = (messageBody) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = yield message_model_1.default.create(messageBody);
    return yield newMessage.populate('chat sender');
});
// Get messages by chat ID with pagination
const getMessages = (chatId_1, ...args_1) => __awaiter(void 0, [chatId_1, ...args_1], void 0, function* (chatId, options = {}) {
    const { limit = 10, page = 1 } = options;
    try {
        const totalResults = yield message_model_1.default.countDocuments({ chat: chatId });
        const totalPages = Math.ceil(totalResults / limit);
        const pagination = { totalResults, totalPages, currentPage: page, limit };
        // console.log([chatId]);
        const skip = (page - 1) * limit;
        const chat = new mongoose_1.default.Types.ObjectId(chatId);
        const messages = yield message_model_1.default.aggregate([
            { $match: { chat: chat } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender',
                },
            },
            { $unwind: '$sender' },
            {
                $lookup: {
                    from: 'chats',
                    localField: 'chat',
                    foreignField: '_id',
                    as: 'chatDetails',
                },
            },
            { $unwind: '$chatDetails' },
            {
                $project: {
                    _id: 1,
                    chat: 1,
                    message: 1,
                    type: 1,
                    sender: {
                        _id: 1,
                        fullName: 1,
                        image: 1,
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        // console.log('messages', messages);
        return { messages, pagination };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve messages');
    }
});
const getMessageById = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    return message_model_1.default.findById(messageId).populate('chat');
});
// Delete a message by ID
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Message not found');
    }
    return result;
});
// Delete messages by chat ID
const deleteMessagesByChatId = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.default.deleteMany({ chat: chatId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete messages');
    }
    return result;
});
// Export all methods in the same format as the old structure
exports.messageService = {
    addMessage,
    getMessageById,
    getMessages,
    deleteMessage,
    deleteMessagesByChatId,
};
