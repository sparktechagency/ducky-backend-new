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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_model_1 = __importDefault(require("./product.model"));
const favorite_model_1 = __importDefault(require("../favorite/favorite.model"));
const promises_1 = require("fs/promises");
const promises_2 = require("fs/promises");
const pickupAddress_model_1 = __importDefault(require("../pickupAddress/pickupAddress.model"));
const createProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isPickupAddressExist = yield pickupAddress_model_1.default.findOne({});
    if (!isPickupAddressExist) {
        throw new AppError_1.default(400, 'Pickup Address is not Found!!');
    }
    const result = yield product_model_1.default.create(payload);
    // if (!result) {
    //   const imagePath = `public/${payload.images}`;
    //   try {
    //     await access(imagePath); // Check if the file exists
    //     await unlink(imagePath);
    //   } catch (error: any) {
    //     console.error(`Error handling file at ${imagePath}:`, error.message);
    //   }
    // }
    if (!result) {
        const imagePaths = payload.images.map((image) => `public/${image}`);
        try {
            // Loop through each image and attempt to delete it
            yield Promise.all(imagePaths.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // Check if the file exists
                    yield (0, promises_1.access)(imagePath);
                    // If the file exists, delete it
                    yield (0, promises_2.unlink)(imagePath);
                }
                catch (error) {
                    console.error(`Error handling file at ${imagePath}:`, error.message);
                }
            })));
        }
        catch (error) {
            console.error('Error deleting images:', error.message);
        }
    }
    return result;
});
const getAllProductQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('query==', query);
    let newQuery = {};
    if (query.minPrice &&
        query.maxPrice &&
        query.minPrice !== '' &&
        query.maxPrice !== '' &&
        query.maxPrice !== null &&
        query.minPrice !== null) {
        const price = {
            $gte: Number(query.minPrice),
            $lte: Number(query.maxPrice),
        };
        delete query.minPrice;
        delete query.maxPrice;
        newQuery = Object.assign(Object.assign({}, query), { price });
    }
    else {
        newQuery = Object.assign({}, query);
    }
    console.log('newQuery filter', newQuery);
    console.log('query filter', query);
    const productQuery = new QueryBuilder_1.default(product_model_1.default.find({ isDeleted: false }), newQuery)
        .search(['name', 'details'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { meta, result };
});
const getSingleProductQuery = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('userId=', userId);
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(404, 'Product Not Found!!');
    }
    console.log('product==', product._id);
    const favoriteProducts = yield favorite_model_1.default.find({ userId });
    const isFavoriteProduct = favoriteProducts.find((favorite) => favorite.productId.equals(product._id));
    console.log('favoriteProducts=', favoriteProducts);
    console.log('isFavoriteProduct==', isFavoriteProduct);
    const updateData = Object.assign(Object.assign({}, product._doc), { isFavorite: isFavoriteProduct ? true : false });
    return updateData;
});
const getAdminSingleProductQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('userId=', userId);
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(404, 'Product Not Found!!');
    }
    return product;
});
const updateSingleProductQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(404, 'Product Not Found!!');
    }
    const { remainingUrl } = payload, rest = __rest(payload, ["remainingUrl"]);
    console.log('rest==', rest);
    if (product.availableStock && rest.availableStock) {
        const differentStock = Math.abs(product.availableStock - rest.availableStock);
        console.log('differentStock', differentStock);
        if (differentStock !== 0) {
            console.log('differentStock==', differentStock);
            rest.stock = product.stock + differentStock;
        }
    }
    console.log('rest==2', rest);
    // const availableStock = rest.availableStock;
    // console.log('availableStock==', availableStock);
    const oldImages = product.images || [];
    console.log('oldImages', oldImages);
    console.log('remainingUrl', remainingUrl);
    const result = yield product_model_1.default.findByIdAndUpdate(id, Object.assign({}, rest), { new: true });
    if (!result) {
        throw new AppError_1.default(403, 'Product updated faield !!');
    }
    const newImages = result.images || [];
    const imagesToDelete = oldImages.filter((oldImage) => !newImages.includes(oldImage));
    console.log('imagesToDelete==', imagesToDelete);
    if (imagesToDelete.length > 0) {
        for (const image of imagesToDelete) {
            const imagePath = `public/${image}`;
            try {
                yield (0, promises_1.access)(imagePath);
                yield (0, promises_2.unlink)(imagePath);
                console.log(`Deleted image: ${imagePath}`);
            }
            catch (error) {
                console.error(`Error handling file at ${imagePath}:`, error.message);
            }
        }
    }
    return result;
});
const deletedProductQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(404, 'Product Not Found!!');
    }
    if (product.isDeleted) {
        throw new AppError_1.default(404, 'Product already deleted !!');
    }
    const result = yield product_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, 'Product Not Found!');
    }
    return result;
});
exports.productService = {
    createProductService,
    getAllProductQuery,
    getSingleProductQuery,
    getAdminSingleProductQuery,
    updateSingleProductQuery,
    deletedProductQuery,
};
