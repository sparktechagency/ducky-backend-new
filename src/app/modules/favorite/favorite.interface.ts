import { Types } from 'mongoose';

export type TfavoriteProduct = {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
};
