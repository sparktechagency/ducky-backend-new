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
exports.cartService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const product_model_1 = __importDefault(require("../product/product.model"));
const user_models_1 = require("../user/user.models");
const cart_model_1 = __importDefault(require("./cart.model"));
const createCartService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.default.findById(payload.productId);
    if (!isProductExist) {
        throw new AppError_1.default(400, 'Product is not Found!!');
    }
    payload.price = Number(isProductExist.price);
    const isUserExist = yield user_models_1.User.findById(payload.userId);
    if (!isUserExist) {
        throw new AppError_1.default(400, 'User is not Found!!');
    }
    const isExistCartProduct = yield cart_model_1.default.findOne({ productId: payload.productId, userId: payload.userId });
    if (isExistCartProduct) {
        throw new AppError_1.default(400, 'This Product is already Exist!!');
    }
    const result = yield cart_model_1.default.create(payload);
    return result;
});
const getAllCartQuery = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteProductQuery = new QueryBuilder_1.default(cart_model_1.default.find({ userId }).populate({ path: 'productId', select: "name images" }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield favoriteProductQuery.modelQuery;
    const meta = yield favoriteProductQuery.countTotal();
    return { meta, result };
});
const singleCartProductQuantityUpdateQuery = (id, action) => __awaiter(void 0, void 0, void 0, function* () {
    const cartProduct = yield cart_model_1.default.findById(id);
    if (!cartProduct) {
        throw new AppError_1.default(400, 'Cart Product is not found!!');
    }
    const product = yield product_model_1.default.findById(cartProduct.productId);
    if (!product) {
        throw new AppError_1.default(400, 'Product not found for this cart item');
    }
    const quantityChange = action === 'increment' ? 1 : action === 'decrement' ? -1 : 0;
    if (cartProduct.quantity + quantityChange < 1) {
        throw new AppError_1.default(400, 'Quantity cannot be less than 0');
    }
    console.log('quantityChange==', quantityChange);
    const newQuantity = cartProduct.quantity + quantityChange;
    // console.log('newQuantity==', newQuantity);
    //  const newTotalPrice = newQuantity * product.price;
    // console.log('newTotalPrice==', newTotalPrice);
    if (product.availableStock < newQuantity) {
        throw new AppError_1.default(400, 'Product is out of stock');
    }
    const result = yield cart_model_1.default.findByIdAndUpdate(id, {
        quantity: newQuantity,
        // price: newTotalPrice,
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to update the quantity');
    }
    return result;
});
const deletedCartQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findById(id);
    if (!cart) {
        throw new AppError_1.default(404, 'Cart Not Found !');
    }
    const result = yield cart_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, 'Cart Not Found or Unauthorized Access!');
    }
    return result;
});
exports.cartService = {
    createCartService,
    getAllCartQuery,
    singleCartProductQuantityUpdateQuery,
    deletedCartQuery,
};
