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
exports.reviewController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const ratings_service_1 = require("./ratings.service");
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewData = req.body;
    const { userId } = req.user;
    // console.log({ userId });
    reviewData.customerId = userId;
    const result = yield ratings_service_1.reviewService.createReviewService(reviewData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review added successfully!',
        data: result,
    });
}));
const getReviewByCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId } = req.query;
    const { meta, result } = yield ratings_service_1.reviewService.getAllReviewByBusinessQuery(req.query, businessId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Review are requered successful!!',
    });
}));
const getSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ratings_service_1.reviewService.getSingleReviewQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Review are requered successful!!',
    });
}));
const updateSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const updateData = req.body;
    const result = yield ratings_service_1.reviewService.updateReviewQuery(id, updateData, userId);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review updated successfully!',
        data: result,
    });
}));
const deleteSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield ratings_service_1.reviewService.deletedReviewQuery(req.params.id, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Review are successful!!',
    });
}));
exports.reviewController = {
    createReview,
    getReviewByCustomer,
    getSingleReview,
    updateSingleReview,
    deleteSingleReview,
};
