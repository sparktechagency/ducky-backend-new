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
exports.wearewuunderApiRequest = void 0;
exports.calculateShippingBox = calculateShippingBox;
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const product_model_1 = __importDefault(require("../product/product.model"));
const apiKey = '7EyVLQIcx2Ul6PISQaTba0Mr96geTdP6';
const wearewuunderApiRequest = (endpoint_1, ...args_1) => __awaiter(void 0, [endpoint_1, ...args_1], void 0, function* (endpoint, method = 'GET', data = {}) {
    const baseUrl = 'https://api.wearewuunder.com/api/v2';
    //  const baseUrl = 'https://api-playground.wearewuunder.com/api/v2';
    const url = `${baseUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    try {
        const response = yield (0, axios_1.default)({
            url,
            method: method.toUpperCase(),
            //  headers: getAuthHeader(),
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            data: method.toUpperCase() === 'GET' ? null : data,
        });
        console.log('response==', response);
        return { data: response.data, status: response.status };
    }
    catch (error) {
        if (error.response) {
            console.error('Error Response:', {
                status: error.response.status,
                data: error.response.data.errors,
                headers: error.response.headers,
                url: url,
                method: method,
                errors: error.response.data.errors,
            });
            if (error.response.status === 401) {
                throw new AppError_1.default(401, 'Unauthorized');
            }
            if (error.response.status === 404) {
                throw new AppError_1.default(404, 'Not found');
            }
        }
        else {
            console.error('Error:', error.message);
        }
        throw error;
    }
});
exports.wearewuunderApiRequest = wearewuunderApiRequest;
function calculateShippingBox(products) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalHeight = 0;
        let totalWidth = 0;
        let totalLength = 0;
        const productPromises = products.map((product) => __awaiter(this, void 0, void 0, function* () {
            const productDetails = yield product_model_1.default.findById(product.productId);
            if (productDetails) {
                totalHeight += Number(productDetails.height) * product.quantity;
                totalWidth += Number(productDetails.width) * product.quantity;
                totalLength += Number(productDetails.length) * product.quantity;
            }
        }));
        yield Promise.all(productPromises);
        console.log('totalHeight', totalHeight);
        console.log('totalWidth', totalWidth);
        console.log('totalLength', totalLength);
        const avgHeight = totalHeight / products.length;
        const avgWidth = totalWidth / products.length;
        const avgLength = totalWidth / products.length;
        return { avgHeight, avgWidth, avgLength };
    });
}
