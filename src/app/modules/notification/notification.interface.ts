import { Types } from "mongoose";

export type TNotification = {
  userId?: Types.ObjectId;
  message: string;
  role?: 'admin' | 'user' ;
  type?: 'info' | 'warning' | 'error' | 'success';
  status?: 'pending' | 'accept' | 'cancel';
  isRead: boolean;
};
