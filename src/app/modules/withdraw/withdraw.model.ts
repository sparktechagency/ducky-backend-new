import { model, Schema } from 'mongoose';
import { TWithdraw } from './withdraw.interface';

const WithdrawSchema = new Schema<TWithdraw>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
    },
    transactionId: { type: String, required: true, unique: true },
    transactionDate: { type: Date, default: Date.now },
    destination: { type: String, required: true },
  },
  { timestamps: true },
);
  

export const Withdraw = model<TWithdraw>('Withdraw', WithdrawSchema);
