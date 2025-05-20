import { Types } from 'mongoose';

export type TProductLish = {
  productId: Types.ObjectId;
  price: Number;
  quantity: Number;
};

export type TOrder = {
  userId: Types.ObjectId;
  productList: [TProductLish];
  totalAmount: Number;
  orderDate: Date;
  status: string;
  paymentStatus: string;
  // history: [
  //   {
  //     status: string;
  //     date: Date;
  //   },
  // ];

  phone_number: string;
  zip_code: string;
  street_name: string;
  state_code: string;
  locality: string;
  house_number: string;
  given_name: string;
  family_name: string;
  country: string;
  business: string;
  address2: string;
  error?: string;
  trackUrl?: string;

};
