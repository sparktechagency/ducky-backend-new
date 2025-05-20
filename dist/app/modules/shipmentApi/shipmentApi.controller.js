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
exports.shippingController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const shipmentApi_service_1 = require("./shipmentApi.service");
const createShipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shippingData = req.body;
    const result = yield shipmentApi_service_1.shippingService.createShippingService(shippingData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Shipping Order added successfully!',
        data: result,
    });
}));
const createShippingRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield shipmentApi_service_1.shippingService.createShippingRequestService(id);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Shipping Request Create SuccessFull!',
        data: result,
    });
}));
const createShippingRates = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shippingData = req.body;
    const result = yield shipmentApi_service_1.shippingService.createShippingRatesService(shippingData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Shipping Order added successfully!',
        data: result,
    });
}));
const getAllShipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield shipmentApi_service_1.shippingService.getAllBookingShippingQuery(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        // meta: meta,
        data: result,
        message: ' All Shipping are requered successful!!',
    });
}));
const getAllShippingRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield shipmentApi_service_1.shippingService.getAllBookingShippingRequestQuery(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        // meta: meta,
        data: result,
        message: ' All Shipping Request are requered successful!!',
    });
}));
const getSingleShipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipmentApi_service_1.shippingService.getSingleShippingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Shipping are requered successful!!',
    });
}));
const deleteSingleShipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipmentApi_service_1.shippingService.deletedShippingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Shipping are successful!!',
    });
}));
exports.shippingController = {
    createShipping,
    createShippingRequest,
    createShippingRates,
    getAllShipping,
    getAllShippingRequest,
    getSingleShipping,
    deleteSingleShipping,
};
