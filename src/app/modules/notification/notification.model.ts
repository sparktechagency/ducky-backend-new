import { Schema, model } from 'mongoose';
import { TNotification } from './notification.interface';

// Define the schema
const NotificationSchema = new Schema<TNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User', // Reference to User model
    },
    message: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: false,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accept', 'cancel'],
      default: 'pending',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the model
const Notification = model<TNotification>('Notification', NotificationSchema);

export default Notification;
