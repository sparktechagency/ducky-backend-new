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
exports.pickupAddressService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const pickupAddress_model_1 = __importDefault(require("./pickupAddress.model"));
const addPickupAddress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPickaddPickupAddress = yield pickupAddress_model_1.default.findOne({});
    if (existingPickaddPickupAddress) {
        return existingPickaddPickupAddress;
    }
    else {
        const result = yield pickupAddress_model_1.default.create(data);
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add music');
        }
        return result;
    }
});
const getPickaddPickupAddress = () => __awaiter(void 0, void 0, void 0, function* () {
    //   const cacheKey = 'pickup_address';
    //   const cachedResult = await client.get(cacheKey);
    //   if (cachedResult) {
    //     return JSON.parse(cachedResult);
    //   }
    const result = yield pickupAddress_model_1.default.findOne();
    //   await client.setEx(cacheKey, 60, JSON.stringify(result)); // Cache for 60 seconds
    return result;
});
const updatePickaddPickupAddress = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pickupAddress_model_1.default.findOneAndUpdate({}, payload, {
        new: true,
    });
    return result;
});
exports.pickupAddressService = {
    addPickupAddress,
    updatePickaddPickupAddress,
    getPickaddPickupAddress,
};
