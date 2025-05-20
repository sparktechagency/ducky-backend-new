import { Types } from 'mongoose';

export interface IChat {
  participants: Types.ObjectId[]; 
  status: 'accepted' | 'blocked'; 

}
