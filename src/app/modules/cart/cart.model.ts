import { model, Schema } from "mongoose";
import { TCart } from "./cart.interface";

const cartSchema = new Schema<TCart>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});


const Cart = model("Cart", cartSchema);

export default Cart;