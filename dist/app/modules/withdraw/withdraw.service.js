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
exports.withdrawService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const withdraw_model_1 = require("./withdraw.model");
// import { Wallet } from '../wallet/wallet.model';
const addWithdrawService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessId, amount, method } = payload;
    const business = yield user_models_1.User.findById(businessId);
    if (!business) {
        throw new AppError_1.default(400, 'Business is not found!');
    }
    if (business.role !== 'user') {
        throw new AppError_1.default(400, 'User is not authorized as a Mentor!!');
    }
    // Validate Withdrawal Amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(400, 'Invalid Withdrawal amount. It must be a positive number.');
    }
    const result = yield withdraw_model_1.Withdraw.create(payload);
    return result;
});
const getAllWithdrawService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const WithdrawQuery = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find().populate('userId'), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield WithdrawQuery.modelQuery;
    const meta = yield WithdrawQuery.countTotal();
    return { meta, result };
});
const getAllWithdrawBybusinessService = (query, businessId) => __awaiter(void 0, void 0, void 0, function* () {
    const WithdrawQuery = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find({ businessId }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield WithdrawQuery.modelQuery;
    const meta = yield WithdrawQuery.countTotal();
    return { meta, result };
});
const singleWithdrawService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield withdraw_model_1.Withdraw.findById(id);
    return task;
});
const deleteSingleWithdrawService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdraw_model_1.Withdraw.deleteOne({ _id: id });
    return result;
});
exports.withdrawService = {
    addWithdrawService,
    getAllWithdrawService,
    singleWithdrawService,
    getAllWithdrawBybusinessService,
    deleteSingleWithdrawService,
};
