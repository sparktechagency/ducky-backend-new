import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    message: { type: String, required: false },
    type: {
      type: String,
      enum: ['general', 'special', 'reply'],
      default: 'general',
    },
    link: { type: String, required: false },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Message =  model('Message', messageSchema);

export default Message;
