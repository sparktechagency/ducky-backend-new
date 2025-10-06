import mongoose, { Schema, Types } from "mongoose";

export type TOrderData = {
     userId: Types.ObjectId;
     phone_number: string;
     zip_code: string;
     street_name: string;
     locality: string;
     house_number: string;
     given_name: string;
     family_name: string;
     country: string;
};

const OrderDataSchema = new Schema<TOrderData>({
     userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
     phone_number: { type: String, required: true },
     zip_code: { type: String, required: true },
     street_name: { type: String, required: true },
     locality: { type: String, required: true },
     house_number: { type: String, required: true },
     given_name: { type: String, required: true },
     family_name: { type: String, required: true },
     country: { type: String, required: true },
});

const OrderData = mongoose.model<TOrderData>('OrderData', OrderDataSchema);
export default OrderData;



