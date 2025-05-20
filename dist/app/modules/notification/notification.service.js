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
exports.notificationService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const notification_model_1 = __importDefault(require("./notification.model"));
const createNotification = (payload, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.default.create([payload], { session });
    if (result) {
        io.emit('notification', result);
    }
    return result;
});
const getAllNotificationQuery = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationQuery = new QueryBuilder_1.default(notification_model_1.default.find({ userId }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield notificationQuery.modelQuery;
    const meta = yield notificationQuery.countTotal();
    return { meta, result };
});
const getAllNotificationByAdminQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationQuery = new QueryBuilder_1.default(notification_model_1.default.find({ role: 'admin' }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield notificationQuery.modelQuery;
    const meta = yield notificationQuery.countTotal();
    return { meta, result };
});
const getSingleNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.default.findById(id);
    return result;
});
const deleteNotification = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the user by ID
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, 'User not found!');
    }
    const notification = yield notification_model_1.default.findById(id);
    if (!notification) {
        throw new AppError_1.default(404, 'Notification is not found!');
    }
    if (notification.userId.toString() !== userId) {
        throw new AppError_1.default(403, 'You are not authorized to access this notification!');
    }
    // Delete the SaveStory
    const result = yield notification_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(500, 'Error deleting SaveStory!');
    }
    return result;
});
const deleteAdminNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.default.findById(id);
    if (!notification) {
        throw new AppError_1.default(404, 'Notification is not found!');
    }
    const result = yield notification_model_1.default.findOneAndDelete({
        _id: id,
        role: 'admin',
    });
    if (!result) {
        throw new AppError_1.default(500, 'Error deleting SaveStory!');
    }
    return result;
});
exports.notificationService = {
    createNotification,
    getAllNotificationQuery,
    getAllNotificationByAdminQuery,
    deleteNotification,
    getSingleNotification,
    deleteAdminNotification,
};
