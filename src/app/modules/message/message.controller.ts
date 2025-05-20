import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { messageService } from './message.service';

// get all messages
const getAllMessages = catchAsync(async (req, res) => {
  const options = {
    page: req.query.page || 1,
    limit: Number(req.query.limit) || 10,
  };
  const chatId = req.query.chatId;
  // console.log({ chatIdController: chatId });
  if (!chatId) {
    throw new Error('ChatId is required in params');
  }
  const result = await messageService.getMessages(chatId, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    //    meta: meta,
    data: result,
    message: 'message get successful!',
  });
});

export const messageController = {
  getAllMessages,
};
