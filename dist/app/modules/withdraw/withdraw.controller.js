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
exports.withdrawController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const withdraw_service_1 = require("./withdraw.service");
const addWithdraw = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const withdrawData = req.body;
    withdrawData.businessId = userId;
    const result = yield withdraw_service_1.withdrawService.addWithdrawService(withdrawData);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Withdraw Successfull!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getAllWithdraw = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdraw_service_1.withdrawService.getAllWithdrawService(req.query);
    // // console.log('result',result)
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Withdraw are retrived Successfull!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getAllWithdrawByBusinessMan = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    // console.log('user id', userId);
    const result = yield withdraw_service_1.withdrawService.getAllWithdrawBybusinessService(req.query, userId);
    // // console.log('result',result)
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'My Withdraw are retrived Successfull!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getSingleWithdraw = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdraw_service_1.withdrawService.singleWithdrawService(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Single Withdraw are retrived Successfull!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const deleteSingleWithdraw = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // give me validation data
    const result = yield withdraw_service_1.withdrawService.deleteSingleWithdrawService(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Single Delete Withdraw Successfull!!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
exports.withdrawController = {
    addWithdraw,
    getAllWithdraw,
    getSingleWithdraw,
    getAllWithdrawByBusinessMan,
    deleteSingleWithdraw,
};
