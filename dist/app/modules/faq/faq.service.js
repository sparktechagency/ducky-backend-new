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
exports.faqService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const faq_model_1 = __importDefault(require("./faq.model"));
const createFaq = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('FAQ payload=', payload);
    const result = yield faq_model_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(403, 'FAQ create faild!!');
    }
    return result;
});
const getAllFaqQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const faqQuery = new QueryBuilder_1.default(faq_model_1.default.find(), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield faqQuery.modelQuery;
    const meta = yield faqQuery.countTotal();
    return { meta, result };
});
const getSingleFaqQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield faq_model_1.default.findById(id);
    if (!faq) {
        throw new AppError_1.default(404, 'Faq Not Found!!');
    }
    return faq;
});
const updateSingleFaqQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('id', id);
    console.log('updated payload', payload);
    const faqProduct = yield faq_model_1.default.findById(id);
    if (!faqProduct) {
        throw new AppError_1.default(404, 'Faq is not found!');
    }
    const result = yield faq_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(403, 'Faq updated faild!!');
    }
    return result;
});
const deletedFaqQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const faq = yield faq_model_1.default.findById(id);
    if (!faq) {
        throw new AppError_1.default(404, 'Faq Not Found!!');
    }
    const result = yield faq_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, 'Faq Result Not Found !');
    }
    return result;
});
exports.faqService = {
    createFaq,
    getAllFaqQuery,
    getSingleFaqQuery,
    updateSingleFaqQuery,
    deletedFaqQuery,
};
