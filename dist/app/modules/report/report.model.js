"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    }
});
const Report = (0, mongoose_1.model)('Report', faqSchema);
exports.default = Report;
