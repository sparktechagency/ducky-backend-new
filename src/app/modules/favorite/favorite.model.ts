import mongoose, { Schema} from 'mongoose';
import { TfavoriteProduct } from './favorite.interface';


const favoriteProductSchema: Schema = new Schema<TfavoriteProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const FavoriteProduct = mongoose.model<TfavoriteProduct>(
  'FavoriteProduct',
  favoriteProductSchema,
);

export default FavoriteProduct;
