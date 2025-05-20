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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatEvents = void 0;
const chat_service_1 = require("../../chat/chat.service");
const handleChatEvents = (socket, data, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('new chat===========', data);
        if (!data.participant || !data.userId) {
            callback({
                status: 'Error',
                message: 'Please provide both participant and userId',
            });
            return;
        }
        let chat = {};
        if (data.participant && data.userId) {
            const existingChat = yield chat_service_1.chatService.getChatByParticipants(data.userId, data.participant);
            if (existingChat && existingChat.status === 'accepted') {
                callback({
                    status: 'Success',
                    chatId: existingChat._id,
                    message: 'Chat already exists',
                });
                return;
            }
            chat = yield chat_service_1.chatService.createChat(data.userId, data.participant);
            // console.log('chat=======****======', chat);
            if (chat && '_id' in chat) {
                callback({
                    status: 'Success',
                    chatId: chat._id,
                    message: 'Chat created successfully',
                });
            }
            else {
                console.error('❌ Error: Chat creation failed!', chat);
                callback({
                    status: 'Error',
                    message: 'Failed to create chat',
                });
            }
        }
        else {
            callback({
                status: 'Error',
                message: 'Must provide at least 2 participants',
            });
        }
    }
    catch (error) {
        callback({ status: 'Error', message: error.message });
    }
});
exports.handleChatEvents = handleChatEvents;
