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
exports.howMadeService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const howMade_model_1 = __importDefault(require("./howMade.model"));
const createHowMade = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('how made payload=', payload);
    const result = yield howMade_model_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(403, "How made create faild!!");
    }
    return result;
});
const getAllHowMadeQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const howMadeQuery = new QueryBuilder_1.default(howMade_model_1.default.find(), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield howMadeQuery.modelQuery;
    const meta = yield howMadeQuery.countTotal();
    return { meta, result };
});
const getSingleHowMadeQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const howMade = yield howMade_model_1.default.findById(id);
    if (!howMade) {
        throw new AppError_1.default(404, 'HowMade Not Found!!');
    }
    return howMade;
});
const updateSingleHowMadeStatusQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('id', id);
    console.log('updated payload', payload);
    const HowMadeProduct = yield howMade_model_1.default.findById(id);
    if (!HowMadeProduct) {
        throw new AppError_1.default(404, 'HowMade Product is not found!');
    }
    const result = yield howMade_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(403, "Ducky made updated faild!!");
    }
    return result;
});
const deletedHowMadeQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const howMade = yield howMade_model_1.default.findById(id);
    if (!howMade) {
        throw new AppError_1.default(404, 'HowMade Not Found!!');
    }
    const result = yield howMade_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, 'HowMade Result Not Found !');
    }
    return result;
});
exports.howMadeService = {
    createHowMade,
    getAllHowMadeQuery,
    getSingleHowMadeQuery,
    updateSingleHowMadeStatusQuery,
    deletedHowMadeQuery,
};
