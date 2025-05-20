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
exports.handleMessageEvents = void 0;
const chat_service_1 = require("../../chat/chat.service");
const message_service_1 = require("../../message/message.service");
const mongoose_1 = require("mongoose");
const handleMessageEvents = (socket, data, callback, io) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = new mongoose_1.Types.ObjectId(data.chat);
        // console.log('chatId', chatId);
        const senderId = new mongoose_1.Types.ObjectId(data.sender);
        // console.log('senderId', senderId);
        const message = yield message_service_1.messageService.addMessage({
            chat: chatId,
            sender: senderId,
            message: data.message,
            type: 'general',
        });
        // console.log('message', message);
        if (message && message._id) {
            const populatedMessage = yield message_service_1.messageService.getMessageById(message._id);
            // console.log('populatedMessage', populatedMessage);
            if (populatedMessage.chat && populatedMessage.chat.participants) {
                const participants = populatedMessage.chat.participants;
                const chatId = data.chat ? data.chat.toString() : 'unknown';
                const chatRoom = 'new-message::' + chatId;
                // console.log('chatRoom', chatRoom);
                socket.broadcast.emit(chatRoom, message);
                const eventName1 = 'update-chatlist::' + participants[0].toString();
                // console.log('eventName1', eventName1);
                const eventName2 = 'update-chatlist::' + participants[1].toString();
                // console.log('eventName2', eventName2);
                // const notificationUser1 = 'user-notification::' + participants[0].toString();
                //  // console.log('notificationUser1', notificationUser1);
                //  const notificationUser2 =
                //    'user-notification::' + participants[1].toString();
                //  // console.log('notificationUser2', notificationUser2);
                // io.emit(notificationUser1, {
                //   message: message.message,
                // });
                // io.emit(notificationUser2, {
                //   message: message.message,
                // });
                const chatListForUser1 = yield chat_service_1.chatService.getChatByParticipantId({ participantId: participants[0] }, { page: 1, limit: 10 });
                // console.log('chatListForUser1', chatListForUser1);
                const chatListForUser2 = yield chat_service_1.chatService.getChatByParticipantId({ participantId: participants[1] }, { page: 1, limit: 10 });
                // console.log('chatListForUser2', chatListForUser2);
                io.emit(eventName1, chatListForUser1);
                io.emit(eventName2, chatListForUser2);
                callback({
                    status: 'Success',
                    message: message.message,
                });
            }
            else {
                callback({
                    status: 'Error',
                    message: 'Chat does not have participants.',
                });
            }
        }
        else {
            callback({
                status: 'Error',
                message: 'Failed to create message.',
            });
        }
    }
    catch (error) {
        console.error('Error handling message events:', error);
        callback({
            status: 'Error',
            message: error.message || 'An error occurred',
        });
    }
});
exports.handleMessageEvents = handleMessageEvents;
