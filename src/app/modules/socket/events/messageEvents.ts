import { chatService } from '../../chat/chat.service';
import { messageService } from '../../message/message.service';
import { Types } from 'mongoose';

interface IMessageData {
  chat: Types.ObjectId;
  message?: string;
  type: 'general' | 'special' | 'reply';
  link?: string;
  sender: Types.ObjectId;
}

export const handleMessageEvents = async (
  socket: any,
  data: IMessageData,
  callback: any,
  io: any,
) => {
  try {
    const chatId = new Types.ObjectId(data.chat);
    // console.log('chatId', chatId);
    const senderId = new Types.ObjectId(data.sender);
    // console.log('senderId', senderId);

    const message = await messageService.addMessage({
      chat: chatId,
      sender: senderId,
      message: data.message,
      type: 'general',
    });
    // console.log('message', message);
    if (message && message._id) {
      const populatedMessage: any = await messageService.getMessageById(
        message._id,
      );
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

        const chatListForUser1 = await chatService.getChatByParticipantId(
          { participantId: participants[0] },
          { page: 1, limit: 10 },
        );
        // console.log('chatListForUser1', chatListForUser1);
        const chatListForUser2 = await chatService.getChatByParticipantId(
          { participantId: participants[1] },
          { page: 1, limit: 10 },
        );
        // console.log('chatListForUser2', chatListForUser2);

        io.emit(eventName1, chatListForUser1);
        io.emit(eventName2, chatListForUser2);

        callback({
          status: 'Success',
          message: message.message,
        });
      } else {
        callback({
          status: 'Error',
          message: 'Chat does not have participants.',
        });
      }
    } else {
      callback({
        status: 'Error',
        message: 'Failed to create message.',
      });
    }
  } catch (error: any) {
    console.error('Error handling message events:', error);
    callback({
      status: 'Error',
      message: error.message || 'An error occurred',
    });
  }
};
