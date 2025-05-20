"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteProductService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_models_1 = require("../user/user.models");
const product_model_1 = __importDefault(require("../product/product.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const favorite_model_1 = __importDefault(require("./favorite.model"));
const createOrDeleteFavoriteProduct = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = payload;
    const prouduct = yield product_model_1.default.findById(productId);
    if (!prouduct) {
        throw new AppError_1.default(404, "Product not found!");
    }
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, 'User not found!');
    }
    // Check if a FavoritecreateOrDeleteFavoriteProduct with the same storyId and userId exists
    const existingFavoriteProduct = yield favorite_model_1.default.findOne({
        productId,
        userId,
    }).populate('productId');
    if (existingFavoriteProduct) {
        // If it exists, delete it and return populated data
        yield favorite_model_1.default.findByIdAndDelete(existingFavoriteProduct._id);
        const favoriteProduct = Object.assign(Object.assign({}, existingFavoriteProduct.toObject()), { favoriteProduct: false });
        return {
            message: 'Favorite Product deleted !!',
            data: favoriteProduct,
        };
    }
    else {
        // If it does not exist, create a new one
        const newFavoriteProduct = new favorite_model_1.default(Object.assign(Object.assign({}, payload), { userId }));
        yield newFavoriteProduct.save();
        const populatedResult = yield newFavoriteProduct.populate('productId');
        const favoriteProduct = Object.assign(Object.assign({}, populatedResult.toObject()), { favoriteProduct: true });
        return {
            message: 'Favorite Product successful',
            data: favoriteProduct,
        };
    }
});
// const createFavoritecreateOrDeleteFavoriteProduct = async (payload:TFavoritecreateOrDeleteFavoriteProduct) => {
//   const result = await FavoritecreateOrDeleteFavoriteProduct.create(payload);
//   return result;
// };
const getAllFavoriteProductByUserQuery = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteProductQuery = new QueryBuilder_1.default(favorite_model_1.default.find({ userId }).populate('productId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield favoriteProductQuery.modelQuery;
    const meta = yield favoriteProductQuery.countTotal();
    return { meta, result };
});
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
exports.favoriteProductService = {
    createOrDeleteFavoriteProduct,
    getAllFavoriteProductByUserQuery,
    // createFavoritecreateOrDeleteFavoriteProduct,
    // deleteFavoritecreateOrDeleteFavoriteProduct,
};
