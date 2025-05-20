import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { withdrawService } from './withdraw.service';

const addWithdraw = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const withdrawData = req.body;
  withdrawData.businessId = userId;

  const result = await withdrawService.addWithdrawService(withdrawData);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdraw Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getAllWithdraw = catchAsync(async (req, res, next) => {
  const result = await withdrawService.getAllWithdrawService(req.query);
  // // console.log('result',result)

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdraw are retrived Successfull!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getAllWithdrawByBusinessMan = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  // console.log('user id', userId);
  const result = await withdrawService.getAllWithdrawBybusinessService(
    req.query,
    userId,
  );
  // // console.log('result',result)
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My Withdraw are retrived Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const getSingleWithdraw = catchAsync(async (req, res, next) => {
  const result = await withdrawService.singleWithdrawService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Withdraw are retrived Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const deleteSingleWithdraw = catchAsync(async (req, res, next) => {
  // give me validation data
  const result = await withdrawService.deleteSingleWithdrawService(
    req.params.id,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Delete Withdraw Successfull!!!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

export const withdrawController = {
  addWithdraw,
  getAllWithdraw,
  getSingleWithdraw,
  getAllWithdrawByBusinessMan,
  deleteSingleWithdraw,
};
