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
exports.favoriteProductController = void 0;
// import Stripe from "stripe";
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const favorite_service_1 = require("./favorite.service");
const createFavoriteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { message, data } = yield favorite_service_1.favoriteProductService.createOrDeleteFavoriteProduct(req.body, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: data,
        message: message,
    });
}));
const getAllFavoriteProductByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield favorite_service_1.favoriteProductService.getAllFavoriteProductByUserQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: result.meta,
        data: result.result,
        message: 'Favorite Product All are requered successful!!',
    });
}));
// const deletedFavoriteProduct = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.user;
//   const result = await FavoriteProductService.deleteFavoriteProduct(req.params.id, userId);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'deleted successful',
//   });
// });
exports.favoriteProductController = {
    createFavoriteProduct,
    getAllFavoriteProductByUser,
    // deletedFavoriteProduct,
};
