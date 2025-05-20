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
exports.productController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const product_service_1 = require("./product.service");
const product_model_1 = __importDefault(require("./product.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hit hoise');
    const productData = req.body;
    const isExist = yield product_model_1.default.findOne({
        name: productData.name,
    });
    if (isExist) {
        throw new AppError_1.default(400, 'Product already exist !');
    }
    productData.availableStock = productData.stock;
    const imageFiles = req.files;
    if ((imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.images) && imageFiles.images.length > 0) {
        productData.images = imageFiles.images.map((file) => file.path.replace(/^public[\\/]/, ''));
    }
    if ((imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.coverImage) && imageFiles.coverImage.length > 0) {
        productData.coverImage = imageFiles.coverImage[0].path.replace(/^public[\\/]/, '');
    }
    const result = yield product_service_1.productService.createProductService(productData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product added successfully!',
        data: result,
    });
}));
const getAllProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meta, result } = yield product_service_1.productService.getAllProductQuery(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Product are requered successful!!',
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield product_service_1.productService.getSingleProductQuery(req.params.id, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Product are requered successful!!',
    });
}));
const getAdminSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getAdminSingleProductQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Admin Product are requered successful!!',
    });
}));
const updateSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(400, 'Product not found !');
    }
    const updateData = req.body;
    let remainingUrl = (updateData === null || updateData === void 0 ? void 0 : updateData.remainingUrl) || null;
    const imageFiles = req.files;
    if ((imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.images) && imageFiles.images.length > 0) {
        updateData.images = imageFiles.images.map((file) => file.path.replace(/^public[\\/]/, ''));
    }
    if ((imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.coverImage) && imageFiles.coverImage.length > 0) {
        updateData.coverImage = imageFiles.coverImage[0].path.replace(/^public[\\/]/, '');
    }
    if (remainingUrl) {
        if (!updateData.images) {
            updateData.images = [];
        }
        updateData.images = [...updateData.images, remainingUrl];
    }
    if (updateData.images && !remainingUrl) {
        updateData.images = [...updateData.images];
    }
    if (updateData.price) {
        updateData.price = Number(updateData.price);
    }
    if (updateData.availableStock) {
        updateData.availableStock = Number(updateData.availableStock);
        const differentStock = Math.abs(Number(product.availableStock) - Number(updateData.availableStock));
        if (differentStock !== 0) {
            updateData.stock = updateData.stock + differentStock;
        }
    }
    console.log('updateData', updateData);
    const result = yield product_service_1.productService.updateSingleProductQuery(id, updateData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Product are updated successful!!',
    });
}));
const deleteSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.deletedProductQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Product are successful!!',
    });
}));
exports.productController = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    getAdminSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
};
