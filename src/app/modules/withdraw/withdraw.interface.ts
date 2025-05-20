import { Types } from "mongoose";

export type TWithdraw = {
  businessId: Types.ObjectId;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  transactionDate: Date;
  destination: string;
};