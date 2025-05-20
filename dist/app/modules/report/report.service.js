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
exports.reportService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const report_model_1 = __importDefault(require("./report.model"));
const createReport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Report payload=', payload);
    const result = yield report_model_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(403, 'Report create faild!!');
    }
    return result;
});
const getAllReportQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ReportQuery = new QueryBuilder_1.default(report_model_1.default.find(), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield ReportQuery.modelQuery;
    const meta = yield ReportQuery.countTotal();
    return { meta, result };
});
exports.reportService = {
    createReport,
    getAllReportQuery,
};
