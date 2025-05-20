"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pickupAddressSchema = new mongoose_1.Schema({
    zip_code: {
        type: String,
        required: true
    },
    street_name: {
        type: String,
        required: true
    },
    state_code: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    house_number: {
        type: String,
        required: true
    },
    given_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    business: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
}, { timestamps: true });
// Create the model
const PickupAddress = (0, mongoose_1.model)('PickupAddress', pickupAddressSchema);
exports.default = PickupAddress;
