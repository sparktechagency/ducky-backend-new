import mongoose from 'mongoose';
import { IChat } from './chat.interface';
const { Schema, model, models } = mongoose;

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ['accepted', 'blocked'],
      default: 'accepted',
    },
  },
  {
    timestamps: true,
  },
);

const Chat =  model('Chat', chatSchema);

export default Chat;
