import { Schema, model, Types } from 'mongoose';
import { TOrder, TProductLish } from './orders.interface';

const ProductLishSchema = new Schema<TProductLish>({
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const historyEntrySchema = new Schema({
  status: { type: String, required: true },
  date: { type: Date, required: false,  },
});

const OrderSchema = new Schema<TOrder>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    productList: { type: [ProductLishSchema], required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'completed',
        'received',
        'ongoing',
        'delivery',
        'finished',
        'cancelled',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    phone_number: { type: String, required: true },
    zip_code: { type: String, required: true },
    street_name: { type: String, required: true },
    state_code: { type: String, required: true },
    locality: { type: String, required: true },
    house_number: { type: String, required: true },
    given_name: { type: String, required: true },
    family_name: { type: String, required: true },
    country: { type: String, required: true },
    business: { type: String, required: true },
    address2: { type: String, required: true },
    error: { type: String, required: false, default: 'false' },
    trackUrl: { type: String, required: false, default: 'false' },
    // history: {
    //   type: [historyEntrySchema],
    //   required: false,
    // },
  },
  { timestamps: true },
);

const Order = model<TOrder>('Order', OrderSchema);

export { Order };
