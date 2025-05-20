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
exports.cartController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const cart_service_1 = require("./cart.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = req.body;
    const { userId } = req.user;
    cartData.userId = userId;
    const result = yield cart_service_1.cartService.createCartService(cartData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cart Product Added Successfully!',
        data: result,
    });
}));
const getAllCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield cart_service_1.cartService.getAllCartQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        // meta: meta,
        data: result,
        message: ' All Cart are requered successful!!',
    });
}));
const singleCartProductQuantityUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, action } = req.params;
    console.log('id', id);
    console.log('action', action);
    if (action !== 'increment' && action !== 'decrement') {
        throw new AppError_1.default(400, "Invalid action. Use 'increment' or 'decrement'.");
    }
    const result = yield cart_service_1.cartService.singleCartProductQuantityUpdateQuery(id, action);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Cart Product Quantity Increment successful!!',
    });
}));
const deleteSingleCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.cartService.deletedCartQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Cart are successful!!',
    });
}));
exports.cartController = {
    createCart,
    getAllCart,
    singleCartProductQuantityUpdate,
    deleteSingleCart,
};
