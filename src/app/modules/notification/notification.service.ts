import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import Notification from './notification.model';
import { TNotification } from './notification.interface';

const createNotification = async (payload: any, session?: any) => {
  const result = await Notification.create([payload], { session });

  if (result) {
    io.emit('notification', result);
  }
  return result;
};

const getAllNotificationQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const notificationQuery = new QueryBuilder(Notification.find({ userId }), query)
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();
  const unReadNotification = await Notification.countDocuments({
    userId,
    isRead: false,
  });
  return { meta, result: { unReadCount: unReadNotification, result } };
};

const getAllNotificationByAdminQuery = async (
  query: Record<string, unknown>,
) => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ role: 'admin' }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();
  return { meta, result };
};

const getSingleNotification = async (id: string) => {
  const result = await Notification.findById(id);
  return result;
};

const getSingleReadNotification = async (id: string, userId: string) => {
  // Fetch the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  const notification: any = await Notification.findById(id);
  if (!notification) {
    throw new AppError(404, 'Notification is not found!');
  }

  if (notification.userId.toString() !== userId) {
    throw new AppError(
      403,
      'You are not authorized to access this notification!',
    );
  }

  // Delete the SaveStory
  const result = await Notification.findByIdAndUpdate(id,{
    $set: {
      isRead: true,
    },
  }, { new: true });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  const unReadNotification = await Notification.countDocuments({
    userId,
    isRead: false,
  });

  return {result, unReadCount: unReadNotification};
};

const getAllReadNotification = async (userId: string) => {
  // Fetch the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  const result = await Notification.updateMany(
    { userId: userId },
    { $set: { isRead: true } },
  );

  const unReadNotification = await Notification.countDocuments({
    userId,
    isRead: false,
  });

  return {result, unReadCount: unReadNotification};
};

const deleteNotification = async (id: string, userId: string) => {
 
  // Fetch the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  const notification:any = await Notification.findById(id);
  if (!notification) {
    throw new AppError(404, 'Notification is not found!');
  }

  if (notification.userId.toString() !== userId) {
    throw new AppError(
      403,
      'You are not authorized to access this notification!',
    );
  }

  // Delete the SaveStory
  const result = await Notification.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

const deleteAdminNotification = async (id: string) => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new AppError(404, 'Notification is not found!');
  }

  const result = await Notification.findOneAndDelete({
    _id: id,
    role: 'admin',
  });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const notificationService = {
  createNotification,
  getAllNotificationQuery,
  getAllNotificationByAdminQuery,
  deleteNotification,
  getSingleNotification,
  getSingleReadNotification,
  getAllReadNotification,
  deleteAdminNotification,
};
