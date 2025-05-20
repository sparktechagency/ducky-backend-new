import { Types } from "mongoose"

 export type TCart = {
    productId:Types.ObjectId;
    userId:Types.ObjectId;
    price:number;
    quantity:number
 }