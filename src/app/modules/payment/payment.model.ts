import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';


const paymentSchema = new Schema<TPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['stripe'],
      required: true,
      default: 'stripe',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'Failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: true,
      unique:true
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    session_id: {
      type: String,
      default: null,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
  },
  { timestamps: true },
);






export const Payment = model<TPayment>('Payment', paymentSchema);
