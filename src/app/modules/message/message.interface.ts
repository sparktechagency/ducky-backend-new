import { Types } from 'mongoose';

export interface IMessage {
  chat: Types.ObjectId; 
  message?: string; 
  type: 'general' | 'special' | 'reply';
  link?: string; 
  sender: Types.ObjectId; 
}
