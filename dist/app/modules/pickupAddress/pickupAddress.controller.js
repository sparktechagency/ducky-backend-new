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
exports.pickupAddressController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pickupAddress_service_1 = require("./pickupAddress.service");
const addPickupAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pickupData = {
        zip_code: "6003 DD",
        street_name: "Marconilaan",
        state_code: "FL",
        phone_number: "15479655248",
        locality: "Weert",
        house_number: "8",
        given_name: "First name",
        family_name: "Last name",
        email_address: "info@examplebusiness.com",
        country: "NL",
        business: "Example Business Ltd",
        address2: "Appartment 4D",
    };
    const result = yield pickupAddress_service_1.pickupAddressService.addPickupAddress(pickupData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pickup Address added successfully',
        data: result,
    });
}));
const getPickupAddresss = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pickupAddress_service_1.pickupAddressService.getPickaddPickupAddress();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pickup Address get successfully!!',
        data: result,
    });
}));
const updatePickupAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const { id } = req.params;
    const pickupAddressData = Object.assign({}, req.body);
    const result = yield pickupAddress_service_1.pickupAddressService.updatePickaddPickupAddress(pickupAddressData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pickup Address update successfully',
        data: result,
    });
}));
exports.pickupAddressController = {
    addPickupAddress,
    updatePickupAddress,
    getPickupAddresss,
};
