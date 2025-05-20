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
exports.chatService = exports.getMyChatList = exports.getChatByParticipantId = exports.deleteChatList = exports.getChatDetailsByParticipantId = exports.getChatByParticipants = exports.getChatById = exports.createChat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chat_model_1 = __importDefault(require("./chat.model"));
// Create a new chat (Equivalent to `createChat` in your old code)
const createChat = (user, participant) => __awaiter(void 0, void 0, void 0, function* () {
    const newChat = new chat_model_1.default({
        participants: [user, participant],
    });
    const savedChat = yield newChat.save();
    return yield savedChat.populate({
        path: 'participants',
        match: { _id: { $ne: user } },
    });
});
exports.createChat = createChat;
// Get chat by ID
const getChatById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_model_1.default.findById(id);
});
exports.getChatById = getChatById;
// Get chat by participants
const getChatByParticipants = (user, participant) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield chat_model_1.default.findOne({
        participants: { $all: [user, participant] },
    }).populate({
        path: 'participants',
        match: { _id: { $ne: user } },
    });
    return chat;
});
exports.getChatByParticipants = getChatByParticipants;
// Get chat details by participant ID
const getChatDetailsByParticipantId = (user, participant) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield chat_model_1.default.findOne({
        participants: { $all: [user, participant] },
    });
    return chat;
});
exports.getChatDetailsByParticipantId = getChatDetailsByParticipantId;
// Delete chat by ID (Equivalent to `deleteChatList` in your old code)
const deleteChatList = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_model_1.default.findByIdAndDelete(chatId);
});
exports.deleteChatList = deleteChatList;
// Get chats by participant ID with pagination and filtering
const getChatByParticipantId = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // // console.log(filters, options);
    // console.log('filters ----', filters);
    try {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 10;
        const skip = (page - 1) * limit;
        const participantId = new mongoose_1.default.Types.ObjectId(filters.participantId);
        // console.log('participantId===', participantId);
        const name = filters.name || '';
        // console.log({ name });
        const allChatLists = yield chat_model_1.default.aggregate([
            { $match: { participants: participantId } },
            {
                $lookup: {
                    from: 'messages',
                    let: { chatId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$chat', '$$chatId'] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $project: { message: 1, createdAt: 1 } },
                    ],
                    as: 'latestMessage',
                },
            },
            { $unwind: { path: '$latestMessage', preserveNullAndEmptyArrays: true } },
            { $sort: { 'latestMessage.createdAt': -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'participants',
                },
            },
            {
                $addFields: {
                    participants: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$participants',
                                    as: 'participant',
                                    cond: { $ne: ['$$participant._id', participantId] },
                                },
                            },
                            as: 'participant',
                            in: {
                                _id: '$$participant._id',
                                fullName: '$$participant.fullName',
                                image: '$$participant.image',
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    participants: {
                        $elemMatch: {
                            fullName: { $regex: name },
                        },
                    },
                },
            },
            {
                $addFields: {
                    participant: { $arrayElemAt: ['$participants', 0] },
                },
            },
            {
                $project: {
                    latestMessage: 1,
                    groupName: 1,
                    type: 1,
                    groupAdmin: 1,
                    image: 1,
                    participant: 1,
                },
            },
            {
                $facet: {
                    totalCount: [{ $count: 'count' }],
                    data: [{ $skip: skip }, { $limit: limit }],
                },
            },
        ]);
        // console.log('allChatLists');
        // console.log(allChatLists);
        const totalResults = ((_b = (_a = allChatLists[0]) === null || _a === void 0 ? void 0 : _a.totalCount) === null || _b === void 0 ? void 0 : _b.length) > 0
            ? (_d = (_c = allChatLists[0]) === null || _c === void 0 ? void 0 : _c.totalCount[0]) === null || _d === void 0 ? void 0 : _d.count
            : 0;
        const totalPages = Math.ceil(totalResults / limit);
        const pagination = { totalResults, totalPages, currentPage: page, limit };
        // return { chatList: allChatLists, pagination };
        return { chatList: (_e = allChatLists[0]) === null || _e === void 0 ? void 0 : _e.data, pagination };
        // return allChatLists;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.getChatByParticipantId = getChatByParticipantId;
// Get participant lists (Equivalent to `getMyChatList` in your old code)
const getMyChatList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myId = new mongoose_1.default.Types.ObjectId(userId);
    const result = yield chat_model_1.default.aggregate([
        { $match: { participants: { $in: [myId] } } },
        { $unwind: '$participants' },
        { $match: { participants: { $ne: myId } } },
        {
            $group: {
                _id: null,
                participantIds: { $addToSet: '$participants' },
            },
        },
    ]);
    return result;
});
exports.getMyChatList = getMyChatList;
// Export all functions as part of chatService object (Optional)
exports.chatService = {
    createChat: exports.createChat,
    getChatById: exports.getChatById,
    getChatByParticipants: exports.getChatByParticipants,
    getChatDetailsByParticipantId: exports.getChatDetailsByParticipantId,
    deleteChatList: exports.deleteChatList,
    getChatByParticipantId: exports.getChatByParticipantId,
    getMyChatList: exports.getMyChatList,
};
