// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { notificationService } from './notification.service';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  const result = await notificationService.createNotification(
    req.body,
    session,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Notification successful',
  });
});

const getAllNotificationByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  // console.log({userId});
  const result = await notificationService.getAllNotificationQuery(
    req.query,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Notification All are requered successful!!',
  });
});

const getAllNotificationByAdmin = catchAsync(async (req, res) => {
  const result = await notificationService.getAllNotificationByAdminQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Notification All are requered successful!!',
  });
});

const getSingleNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.getSingleNotification(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Single notification get successful',
    });
  },
);

const getSingleReadNotification = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await notificationService.getSingleReadNotification(
      req.params.id,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Single notification read get successful',
    });
  },
);


const getAllReadNotification = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await notificationService.getAllReadNotification(
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Single notification read get successful',
    });
  },
);

const deletedNotification = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await notificationService.deleteNotification(
    req.params.id,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

const deletedAdminNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.deleteAdminNotification(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Notification deleted successful',
    });
  },
);

export const NotificationController = {
  createNotification,
  getAllNotificationByUser,
  getAllNotificationByAdmin,
  getSingleNotification,
  getSingleReadNotification,
  getAllReadNotification,
  deletedNotification,
  deletedAdminNotification,
};
