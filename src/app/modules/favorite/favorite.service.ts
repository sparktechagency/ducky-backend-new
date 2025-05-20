import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import { TfavoriteProduct } from './favorite.interface';
import Product from '../product/product.model';
import AppError from '../../error/AppError';
import FavoriteProduct from './favorite.model';

const createOrDeleteFavoriteProduct = async (
  payload: TfavoriteProduct,
  userId: string,
) => {
  const { productId } = payload;

  const prouduct = await Product.findById(productId);

  if (!prouduct){
    throw new AppError(404, "Product not found!");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found!');
  }
    // Check if a FavoritecreateOrDeleteFavoriteProduct with the same storyId and userId exists
    const existingFavoriteProduct = await FavoriteProduct.findOne({
      productId,
      userId,
    }).populate('productId');

  if (existingFavoriteProduct) {
    // If it exists, delete it and return populated data
    await FavoriteProduct.findByIdAndDelete(existingFavoriteProduct._id);
    const favoriteProduct = {
      ...existingFavoriteProduct.toObject(),
      favoriteProduct: false,
    };
    return {
      message: 'Favorite Product deleted !!',
      data: favoriteProduct,
    };
  } else {
    // If it does not exist, create a new one
    const newFavoriteProduct = new FavoriteProduct({
      ...payload,
      userId,
    });
    await newFavoriteProduct.save();
    const populatedResult = await newFavoriteProduct.populate('productId');
    const favoriteProduct = {
      ...populatedResult.toObject(),
      favoriteProduct: true,
    };
    return {
      message: 'Favorite Product successful',
      data: favoriteProduct,
    };
  }
};

// const createFavoritecreateOrDeleteFavoriteProduct = async (payload:TFavoritecreateOrDeleteFavoriteProduct) => {
//   const result = await FavoritecreateOrDeleteFavoriteProduct.create(payload);
//   return result;
// };

const getAllFavoriteProductByUserQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const favoriteProductQuery = new QueryBuilder(
    FavoriteProduct.find({ userId }).populate('productId'),
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

// const deleteFavoritecreateOrDeleteFavoriteProduct = async (id: string, userId: string) => {
//   // Fetch the FavoritecreateOrDeleteFavoriteProduct by ID
//   const FavoritecreateOrDeleteFavoriteProduct = await FavoritecreateOrDeleteFavoriteProduct.findById(id);
//   if (!FavoritecreateOrDeleteFavoriteProduct) {
//     throw new AppError(404, 'FavoritecreateOrDeleteFavoriteProduct not found!');
//   }

//   // Fetch the user by ID
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new AppError(404, 'User not found!');
//   }

//   // Ensure the FavoritecreateOrDeleteFavoriteProduct belongs to the user
//   if (FavoritecreateOrDeleteFavoriteProduct.userId.toString() !== userId) {
//     throw new AppError(403, 'You are not authorized to delete this FavoritecreateOrDeleteFavoriteProduct!');
//   }

//   // Delete the FavoritecreateOrDeleteFavoriteProduct
//   const result = await FavoritecreateOrDeleteFavoriteProduct.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError(500, 'Error deleting FavoritecreateOrDeleteFavoriteProduct!');
//   }

//   return result;
// };

export const favoriteProductService = {
  createOrDeleteFavoriteProduct,
  getAllFavoriteProductByUserQuery,
  // createFavoritecreateOrDeleteFavoriteProduct,
  // deleteFavoritecreateOrDeleteFavoriteProduct,
};
