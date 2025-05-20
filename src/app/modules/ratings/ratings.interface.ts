import { Types } from 'mongoose';

export type TReview = {
  customerId: Types.ObjectId;
  businessId: Types.ObjectId;
  rating: number;
  review: string;
};
