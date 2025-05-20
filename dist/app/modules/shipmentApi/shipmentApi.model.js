"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentRequestApi = exports.ShipmentApi = void 0;
const mongoose_1 = require("mongoose");
const shipmentApiSchema = new mongoose_1.Schema({
    shippingbookingId: { type: String, required: true }
});
const ShipmentApi = (0, mongoose_1.model)('ShipmentApi', shipmentApiSchema);
exports.ShipmentApi = ShipmentApi;
// export default ShipmentApi;
const shipmentRequestSchema = new mongoose_1.Schema({
    shipmentRequestId: { type: String, required: true },
});
const ShipmentRequestApi = (0, mongoose_1.model)('ShipmentRequestApi', shipmentRequestSchema);
exports.ShipmentRequestApi = ShipmentRequestApi;
