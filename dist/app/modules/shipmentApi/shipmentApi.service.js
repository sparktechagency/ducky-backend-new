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
exports.shippingService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const shipmentApi_utils_1 = require("./shipmentApi.utils");
const axios_1 = __importDefault(require("axios"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const orders_model_1 = require("../orders/orders.model");
const user_models_1 = require("../user/user.models");
const shipmentApi_model_1 = require("./shipmentApi.model");
const pickupAddress_model_1 = __importDefault(require("../pickupAddress/pickupAddress.model"));
// import Business from '../business/business.model';
// const apiKey = '7EyVLQIcx2Ul6FISHTba0Mr96geTdP6';
const apiKey = '7EyVLQIcx2Ul6PISQaTba0Mr96geTdP6';
const createShippingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_model_1.Order.findById(payload.orderId);
    if (!order) {
        throw new AppError_1.default(400, 'Order is not found!');
    }
    const user = yield user_models_1.User.findById(order.userId);
    if (!user) {
        throw new AppError_1.default(400, 'User is not found!');
    }
    const pickupAddress = yield pickupAddress_model_1.default.findOne({});
    if (!pickupAddress) {
        throw new AppError_1.default(400, 'Pickup Address is not found!');
    }
    const heightAndWidthAndLength = yield (0, shipmentApi_utils_1.calculateShippingBox)(order.productList);
    const productItems = yield Promise.all(order.productList.map((productItem) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(productItem.productId);
        if (!product) {
            throw new AppError_1.default(400, 'Product not found for this cart item');
        }
        return {
            weight: Number(product.weight),
            value: productItem.price,
            quantity: productItem.quantity,
            description: 'string',
        };
    })));
    // calculateShippingBox(order.productList)
    //   .then((heightAndWidth) => {
    //     console.log('heightAndWidth==', heightAndWidth);
    //   })
    //   .catch((err) => {
    //     console.error('Error calculating shipping box:', err);
    //   });
    // const url = 'https://api.wearewuunder.com/api/v2/bookings';
    console.log('heightAndWidth==', heightAndWidthAndLength);
    const shippingData = {
        width: Math.ceil(heightAndWidthAndLength.avgWidth), // in centimeters
        // weight: 1000, // in grams
        // webhook_url: 'string',
        // value: 40000, // value in eurocents (e.g., €400.00)
        // redirect_url: 'string',
        // preferred_service_level: 'post_nl:cheapest',
        // picture: 'string',
        pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
        pickup_address: {
            zip_code: pickupAddress.zip_code,
            street_name: pickupAddress.street_name,
            state_code: pickupAddress.state_code,
            phone_number: pickupAddress.phone_number,
            locality: pickupAddress.locality,
            house_number: pickupAddress.house_number,
            given_name: pickupAddress.given_name,
            family_name: pickupAddress.family_name,
            email_address: pickupAddress.email_address,
            country: pickupAddress.country,
            business: pickupAddress.business,
            address2: pickupAddress.address2,
        },
        // personal_message: 'A very personal message',
        // parcelshop_id: 'POST_NL:1234',
        order_lines: productItems,
        meta: {},
        length: Math.ceil(heightAndWidthAndLength.avgLength), // in centimeters
        kind: 'package',
        is_return: false,
        height: Math.ceil(heightAndWidthAndLength.avgHeight), // in centimeters
        drop_off: false,
        description: 'description',
        delivery_address: {
            zip_code: order.zip_code,
            street_name: order.street_name,
            state_code: order.state_code,
            phone_number: order.phone_number,
            locality: order.locality,
            house_number: order.house_number,
            given_name: order.given_name,
            family_name: order.family_name,
            email_address: user.email,
            country: order.country,
            business: order.business,
            address2: order.address2,
        },
        customer_reference: 'W202301',
    };
    const shipingBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)('bookings', 'POST', shippingData);
    if (shipingBooking.status === 201) {
        const data = {
            shippingbookingId: shipingBooking.data.id,
        };
        const shipingApi = yield shipmentApi_model_1.ShipmentApi.create(data);
        if (!shipingApi) {
            throw new AppError_1.default(400, 'ShipmentApi creqate failed!');
        }
    }
    return shipingBooking;
});
const createShippingRequestService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("id===", id);
    const shipingApiExist = yield shipmentApi_model_1.ShipmentApi.findOne({ shippingbookingId: id });
    if (!shipingApiExist) {
        throw new AppError_1.default(400, 'ShipmentBooking id is not found!');
    }
    const pickupAddress = yield pickupAddress_model_1.default.findOne({});
    if (!pickupAddress) {
        throw new AppError_1.default(400, 'Pickup Address is not found!');
    }
    const singleBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)(`bookings/${id}`, 'GET');
    if (singleBooking.status === 200) {
        const data = singleBooking.data;
        if (!data.width || data.width <= 0) {
            throw new AppError_1.default(400, 'Width must be greater than 0');
        }
        if (!data.customer_reference) {
            throw new AppError_1.default(400, "Customer reference can't be blank");
        }
        // console.log('data===', data);
        const orderItems = data.order_lines.map((item) => {
            return {
                weight: item.weight,
                value: item.value,
                quantity: item.quantity,
                description: item.description,
            };
        });
        // console.log('orderItems====', orderItems);
        const shipmentRequestData = {
            width: data.width, // in centimeters
            // pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
            preferred_service_level: 'any:most_efficient',
            pickup_address: {
                zip_code: pickupAddress.zip_code,
                street_name: pickupAddress.street_name,
                state_code: pickupAddress.state_code,
                phone_number: pickupAddress.phone_number,
                locality: pickupAddress.locality,
                house_number: pickupAddress.house_number,
                given_name: pickupAddress.given_name,
                family_name: pickupAddress.family_name,
                email_address: pickupAddress.email_address,
                country: pickupAddress.country,
                business: pickupAddress.business,
                address2: pickupAddress.address2,
            },
            personal_message: 'A very personal message',
            // parcelshop_id: 'POST_NL:1234',
            order_lines: orderItems,
            meta: {},
            length: 40, // in centimeters
            kind: 'package',
            is_return: false,
            height: data.height, // in centimeters
            drop_off: false,
            description: 'description',
            delivery_address: {
                zip_code: data.delivery_address.zip_code,
                street_name: data.delivery_address.street_name,
                state_code: data.delivery_address.state_code,
                phone_number: data.delivery_address.phone_number,
                locality: data.delivery_address.locality,
                house_number: data.delivery_address.house_number,
                given_name: data.delivery_address.given_name,
                family_name: data.delivery_address.family_name,
                email_address: data.delivery_address.email_address,
                country: data.delivery_address.country,
                business: data.delivery_address.business,
                address2: data.delivery_address.address2,
            },
            delivery_instructions: 'delivery instructions',
            customer_reference: data.customer_reference,
        };
        console.log('shipmentRequestData===========', shipmentRequestData);
        // const requestData = {
        //   width: 30,
        //   weight: 1000,
        //   webhook_url: 'string',
        //   value: 40000,
        //   request_pickup: true,
        //   preferred_service_level: 'post_nl:cheapest',
        //   picture: 'string',
        //   pickup_address: {
        //     zip_code: '6003 DD',
        //     vat: 'NL8559.62.100',
        //     street_name: 'Marconilaan',
        //     state_code: 'FL',
        //     phone_number: '+31683243251',
        //     locality: 'Weert',
        //     house_number: '8',
        //     given_name: 'First name',
        //     family_name: 'Last name',
        //     eori_number: 'NL8559.62.100',
        //     email_address: 'info@examplebusiness.com',
        //     country: 'NL',
        //     business: 'Example Business Ltd.',
        //     address2: 'Appartment 4D',
        //   },
        //   personal_message: 'A very personal message',
        //   parcelshop_id: 'POST_NL:1234',
        //   ordered_at: '2024-04-11T16:44:21.013152',
        //   order_lines: [
        //     {
        //       weight: 1000,
        //       value: '5.99',
        //       sku: '54321',
        //       quantity: 1,
        //       hs_code: '1234567890',
        //       ean: '12345',
        //       description: 'string',
        //       country_of_origin: 'NL',
        //     },
        //   ],
        //   number_of_items: 1,
        //   meta: {},
        //   length: 40,
        //   kind: 'package',
        //   is_return: false,
        //   incoterms: 'DDP',
        //   height: 20,
        //   drop_off: false,
        //   description: '1x API documentation',
        //   delivery_address: {
        //     zip_code: '6003 DD',
        //     vat: 'NL8559.62.100',
        //     street_name: 'Marconilaan',
        //     state_code: 'FL',
        //     phone_number: '+31683243251',
        //     locality: 'Weert',
        //     house_number: '8',
        //     given_name: 'First name',
        //     family_name: 'Last name',
        //     eori_number: 'NL8559.62.100',
        //     email_address: 'info@examplebusiness.com',
        //     country: 'NL',
        //     business: 'Example Business Ltd.',
        //     address2: 'Appartment 4D',
        //   },
        //   deliver_by: '2023-02-29',
        //   customer_reference: 'W202301',
        // };
        const shipmentRequestBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)('shipments', 'POST', shipmentRequestData);
        console.log('shipmentRequestBooking==*****', shipmentRequestBooking);
        if (shipmentRequestBooking.status === 201) {
            const data = {
                shipmentRequestId: shipmentRequestBooking.data.id,
            };
            const shipingApi = yield shipmentApi_model_1.ShipmentRequestApi.create(data);
            if (!shipingApi) {
                throw new AppError_1.default(400, 'ShipmentRequestApi creqate failed!');
            }
        }
        return shipmentRequestBooking.data;
    }
});
const getAllBookingShippingRequestQuery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.ids || data.ids.length === 0) {
        throw new AppError_1.default(403, 'Invalid input parameters: No IDs provided');
    }
    const allIds = yield shipmentApi_model_1.ShipmentRequestApi.find();
    const invalidIds = data.ids.filter((id) => !allIds.some((shipment) => shipment.shipmentRequestId.toString() === id));
    if (invalidIds.length > 0) {
        throw new AppError_1.default(403, `Invalid input parameters: The following IDs do not exist: ${invalidIds.join(', ')}`);
    }
    const bookingPromises = data.ids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const singleBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)(`shipments/${id}`, 'GET');
        return singleBooking.data;
    }));
    const allBookingsRequest = yield Promise.all(bookingPromises);
    return allBookingsRequest;
});
const createShippingRatesService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productItems = yield Promise.all(payload.cartIds.map((cartId) => __awaiter(void 0, void 0, void 0, function* () {
        const cartProduct = yield cart_model_1.default.findById(cartId);
        if (!cartProduct) {
            throw new AppError_1.default(400, 'Cart is not found!');
        }
        const product = yield product_model_1.default.findById(cartProduct.productId);
        if (!product) {
            throw new AppError_1.default(400, 'Product not found for this cart item');
        }
        return {
            weight: Number(product.weight),
            value: cartProduct.price,
            quantity: cartProduct.quantity,
            description: 'string',
        };
    })));
    const pickupAddress = yield pickupAddress_model_1.default.findOne({});
    if (!pickupAddress) {
        throw new AppError_1.default(400, 'Pickup Address is not found!');
    }
    const productList = yield Promise.all(payload.cartIds.map((cartId) => __awaiter(void 0, void 0, void 0, function* () {
        const cartProduct = yield cart_model_1.default.findById(cartId);
        if (!cartProduct) {
            throw new AppError_1.default(400, 'Cart is not found!');
        }
        const product = yield product_model_1.default.findById(cartProduct.productId);
        if (!product) {
            throw new AppError_1.default(400, 'Product not found for this cart item');
        }
        return {
            productId: product._id,
            quantity: cartProduct.quantity,
            name: product.name,
            height: Number(product.height),
            width: Number(product.width),
            length: Number(product.length),
        };
    })));
    const heightAndWidthAndLength = yield (0, shipmentApi_utils_1.calculateShippingBox)(productList);
    // const url = 'https://api.wearewuunder.com/api/v2/bookings/rates';
    const shippingData = {
        width: Math.ceil(heightAndWidthAndLength.avgWidth), // in centimeters
        // weight: 1000, // in grams
        // webhook_url: 'string',
        // value: 40000, // value in eurocents (e.g., €400.00)
        // redirect_url: 'string',
        // preferred_service_level: 'post_nl:cheapest',
        // picture: 'string',
        // pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
        pickup_address: {
            zip_code: pickupAddress.zip_code,
            street_name: pickupAddress.street_name,
            state_code: pickupAddress.state_code,
            phone_number: pickupAddress.phone_number,
            locality: pickupAddress.locality,
            house_number: pickupAddress.house_number,
            given_name: pickupAddress.given_name,
            family_name: pickupAddress.family_name,
            email_address: pickupAddress.email_address,
            country: pickupAddress.country,
            business: pickupAddress.business,
            address2: pickupAddress.address2,
        },
        // personal_message: 'A very personal message',
        // parcelshop_id: 'POST_NL:1234',
        order_lines: productItems,
        meta: {},
        length: Math.ceil(heightAndWidthAndLength.avgLength), // in centimeters
        kind: 'package',
        is_return: false,
        incoterms: 'DDP',
        height: Math.ceil(heightAndWidthAndLength.avgHeight), // in centimeters
        drop_off: false,
        description: 'string',
        delivery_address: {
            zip_code: payload.zip_code,
            street_name: payload.street_name,
            state_code: payload.state_code,
            phone_number: payload.phone_number,
            locality: payload.locality,
            house_number: payload.house_number,
            given_name: payload.given_name,
            family_name: payload.family_name,
            // email_address: payload.email_address,
            country: payload.country,
            business: payload.business,
            address2: payload.address2,
        },
        customer_reference: 'W202301',
    };
    // console.log('shippingData=======', shippingData);
    let result;
    try {
        result = yield axios_1.default.post('https://api.wearewuunder.com/api/v2/bookings/rates', shippingData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        // console.log('resulet ======', result);
        console.log('shipingRates==result', result);
    }
    catch (error) {
        if (error.response.status === 422) {
            throw new AppError_1.default(403, "Your Information is not Valid");
        }
    }
    // const shipingRates = await wearewuunderApiRequest(
    //   'bookings/rates',
    //   'POST',
    //   shippingData,
    // );
    // console.log('shipingRates====', shipingRates);
    // return shipingRates.rates;
    return (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.rates;
});
const getAllBookingShippingQuery = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.ids || data.ids.length === 0) {
        throw new AppError_1.default(403, 'Invalid input parameters: No IDs provided');
    }
    const allIds = yield shipmentApi_model_1.ShipmentApi.find();
    const invalidIds = data.ids.filter((id) => !allIds.some((shipment) => shipment.shippingbookingId.toString() === id));
    if (invalidIds.length > 0) {
        throw new AppError_1.default(403, `Invalid input parameters: The following IDs do not exist: ${invalidIds.join(', ')}`);
    }
    const bookingPromises = data.ids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const singleBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)(`bookings/${id}`, 'GET');
        return singleBooking.data;
    }));
    const allBookings = yield Promise.all(bookingPromises);
    return allBookings;
});
const getSingleShippingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('id', id);
    const singleBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)(`bookings/${id}`, 'GET');
    console.log('singleBooking==', singleBooking);
    if (!singleBooking) {
        throw new AppError_1.default(404, 'Booking Not Found!!');
    }
    return singleBooking.data;
});
const deletedShippingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const shipmentApi = yield shipmentApi_model_1.ShipmentApi.findOne({
        shippingbookingId: id,
    });
    if (!shipmentApi) {
        throw new AppError_1.default(404, 'Booking Id is Not Found!!');
    }
    const singleBooking = yield (0, shipmentApi_utils_1.wearewuunderApiRequest)(`bookings/${id}`, 'DELETE');
    if (singleBooking.status === 204) {
        const deleted = yield shipmentApi_model_1.ShipmentApi.findOneAndDelete({
            shippingbookingId: id,
        });
        if (!deleted) {
            throw new AppError_1.default(404, 'Booking Deletion Failed in Local Database!');
        }
    }
    else {
        throw new AppError_1.default(500, 'Failed to delete the booking from Wuunder');
    }
    return null;
});
exports.shippingService = {
    createShippingService,
    createShippingRequestService,
    createShippingRatesService,
    getAllBookingShippingQuery,
    getAllBookingShippingRequestQuery,
    getSingleShippingQuery,
    deletedShippingQuery,
};
