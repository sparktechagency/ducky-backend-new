import { chatService } from '../../chat/chat.service';

interface IChat {
  _id: string;
  status: string;
  participants: string[];
}

export const handleChatEvents = async (
  socket: any,
  data: any,
  callback: any,
) => {
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
      const existingChat = await chatService.getChatByParticipants(
        data.userId,
        data.participant,
      );
      if (existingChat && existingChat.status === 'accepted') {
        callback({
          status: 'Success',
          chatId: existingChat._id,
          message: 'Chat already exists',
        });
        return;
      }

      chat = await chatService.createChat(data.userId, data.participant);

      // console.log('chat=======****======', chat);

      if (chat && '_id' in chat) {
        callback({
          status: 'Success',
          chatId: chat._id,
          message: 'Chat created successfully',
        });
      } else {
        console.error('❌ Error: Chat creation failed!', chat);
        callback({
          status: 'Error',
          message: 'Failed to create chat',
        });
      }
    } else {
      callback({
        status: 'Error',
        message: 'Must provide at least 2 participants',
      });
    }
  } catch (error: any) {
    callback({ status: 'Error', message: error.message });
  }
};
