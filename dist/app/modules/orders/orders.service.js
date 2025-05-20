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
exports.orderService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const orders_model_1 = require("./orders.model");
const notification_service_1 = require("../notification/notification.service");
const getAllOrderQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const OrderQuery = new QueryBuilder_1.default(orders_model_1.Order.find({ paymentStatus: 'paid' }).populate('productList.productId').populate('userId'), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield OrderQuery.modelQuery;
    const meta = yield OrderQuery.countTotal();
    return { meta, result };
});
const getAllOrderByUserQuery = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const OrderQuery = new QueryBuilder_1.default(orders_model_1.Order.find({ userId: userId, paymentStatus: 'paid' }).populate('productList.productId'), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield OrderQuery.modelQuery;
    const meta = yield OrderQuery.countTotal();
    return { meta, result };
});
const getSingleOrderQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_model_1.Order.findById(id).populate('productList.productId').populate('userId');
    if (!order) {
        throw new AppError_1.default(404, 'Order Not Found!!');
    }
    return order;
});
const updateSingleOrderStatusQuery = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('id', id);
    console.log('status', status);
    const orderProduct = yield orders_model_1.Order.findById(id);
    if (!orderProduct) {
        throw new AppError_1.default(404, 'Order Product is not found!');
    }
    const statusSequence = {
        completed: ['received', 'cancelled'],
        received: ['ongoing'],
        ongoing: ['delivery'],
        delivery: ['finished'],
    };
    const currentStatus = orderProduct.status;
    console.log('currentStatus:', currentStatus);
    console.log('valid transitions for this status:', statusSequence[currentStatus]);
    if (!((_a = statusSequence[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(status))) {
        throw new AppError_1.default(400, `Invalid status update! You cannot change the status from ${currentStatus} to ${status}.`);
    }
    const updateHistory = orderProduct.history.find((oldHis) => oldHis.status === status);
    console.log('updateHistory==', updateHistory);
    if (updateHistory) {
        updateHistory.date = new Date();
    }
    orderProduct.status = status;
    yield orderProduct.save();
    if (orderProduct) {
        const notification = yield notification_service_1.notificationService.createNotification({
            userId: orderProduct.userId,
            message: `Your order with id ${orderProduct.id} is ${orderProduct.status}`,
            type: 'success',
        });
        if (notification) {
            io.emit('notification', notification);
        }
    }
    return orderProduct;
});
const deletedOrderQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const order = yield orders_model_1.Order.findById(id);
    if (!order) {
        throw new AppError_1.default(404, 'Order Not Found!!');
    }
    const result = yield orders_model_1.Order.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, 'Order Result Not Found !');
    }
    return result;
});
exports.orderService = {
    getAllOrderQuery,
    getAllOrderByUserQuery,
    getSingleOrderQuery,
    updateSingleOrderStatusQuery,
    deletedOrderQuery,
};
