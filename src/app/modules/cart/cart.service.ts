import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import Product from '../product/product.model';
import { User } from '../user/user.models';
import { TCart } from './cart.interface';
import Cart from './cart.model';

const createCartService = async (payload: TCart) => {
  const isProductExist = await Product.findById(payload.productId);
  if (!isProductExist) {
    throw new AppError(400, 'Product is not Found!!');
  }

  payload.price = Number(isProductExist.price); 

  const isUserExist = await User.findById(payload.userId);
  if (!isUserExist) {
    throw new AppError(400, 'User is not Found!!');
  }

  const isExistCartProduct = await Cart.findOne({productId:payload.productId, userId:payload.userId});
    if (isExistCartProduct) {
      throw new AppError(400, 'This Product is already Exist!!');
    }

  const result = await Cart.create(payload);

  return result;
};

const getAllCartQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const favoriteProductQuery = new QueryBuilder(
    Cart.find({ userId }).populate({
      path: 'productId',
      select: 'name  coverImage',
    }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await favoriteProductQuery.modelQuery;
  const meta = await favoriteProductQuery.countTotal();
  return { meta, result };
};



const singleCartProductQuantityUpdateQuery = async (
  id: string,
  action: 'increment' | 'decrement',
) => {
  const cartProduct = await Cart.findById(id);

  if (!cartProduct) {
    throw new AppError(400, 'Cart Product is not found!!');
  }

   const product:any = await Product.findById(cartProduct.productId);

   if (!product) {
     throw new AppError(400, 'Product not found for this cart item');
   }

  const quantityChange =
    action === 'increment' ? 1 : action === 'decrement' ? -1 : 0;

  if (cartProduct.quantity + quantityChange < 1) {
    throw new AppError(400, 'Quantity cannot be less than 0');
  }

  console.log('quantityChange==', quantityChange);

    const newQuantity = cartProduct.quantity + quantityChange;
  // console.log('newQuantity==', newQuantity);
  //  const newTotalPrice = newQuantity * product.price;
  // console.log('newTotalPrice==', newTotalPrice);

  if(product.availableStock < newQuantity) {
    throw new AppError(400, 'Product is out of stock');
  }

  const result = await Cart.findByIdAndUpdate(
    id,
    {
      quantity: newQuantity,
      // price: newTotalPrice,
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to update the quantity');
  }
  return result;
};

const deletedCartQuery = async (id: string) => {
  const cart = await Cart.findById(id);
  if (!cart) {
    throw new AppError(404, 'Cart Not Found !');
  }
  const result = await Cart.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Cart Not Found or Unauthorized Access!');
  }

  return result;
};

export const cartService = {
  createCartService,
  getAllCartQuery,
  singleCartProductQuantityUpdateQuery,
  deletedCartQuery,
};
