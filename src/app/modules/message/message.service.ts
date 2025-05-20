import mongoose, { Types } from 'mongoose';
import httpStatus from 'http-status';
import Message from './message.model';
import AppError from '../../error/AppError';

// Add a new message
const addMessage = async (messageBody: any) => {
  const newMessage = await Message.create(messageBody);
  return await newMessage.populate('chat sender');
};

// Get messages by chat ID with pagination
const getMessages = async (chatId: any, options = {}) => {
  const { limit = 10, page = 1 }: { limit?: number; page?: number } = options;

  try {
    const totalResults = await Message.countDocuments({ chat: chatId });
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };

    // console.log([chatId]);

    const skip = (page - 1) * limit;
    const chat = new mongoose.Types.ObjectId(chatId);

    const messages = await Message.aggregate([
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
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve messages',
    );
  }
};

const getMessageById = async (messageId: Types.ObjectId) => {
  return Message.findById(messageId).populate('chat');
};

// Delete a message by ID
const deleteMessage = async (id: string) => {
  const result = await Message.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }
  return result;
};

// Delete messages by chat ID
const deleteMessagesByChatId = async (chatId: string) => {
  const result = await Message.deleteMany({ chat: chatId });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete messages');
  }
  return result;
};

// Export all methods in the same format as the old structure
export const messageService = {
  addMessage,
  getMessageById,
  getMessages,
  deleteMessage,
  deleteMessagesByChatId,
};
