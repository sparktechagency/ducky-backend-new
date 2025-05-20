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
exports.reviewService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ratings_model_1 = require("./ratings.model");
// import Business from '../business/business.model';
const createReviewService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   // console.log('Payload:', payload);
    //   const customer = await User.findById(payload.customerId);
    //   if (!customer) {
    //     throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    //   }
    //   const business = await Business.findById(payload.businessId);
    //   if (!business) {
    //     throw new AppError(httpStatus.NOT_FOUND, 'Business not found!');
    //   }
    //   // console.log({ business });
    //   const result = await Review.create(payload);
    //   if (!result) {
    //     throw new AppError(
    //       httpStatus.BAD_REQUEST,
    //       'Failed to add Business review!',
    //     );
    //   }
    //   // console.log({ result });
    //   let { reviewCount, ratings } = business;
    //   // console.log({ ratings });
    //   // console.log({ reviewCount });
    //   const newRating =
    //     (ratings * reviewCount + result.rating) / (reviewCount + 1);
    //   // console.log({ newRating });
    //   const updatedRegistration = await Business.findByIdAndUpdate(
    //     business._id,
    //     {
    //       reviewCount: reviewCount + 1,
    //       ratings: newRating,
    //     },
    //     { new: true },
    //   );
    //   if (!updatedRegistration) {
    //     throw new AppError(
    //       httpStatus.INTERNAL_SERVER_ERROR,
    //       'Failed to update Business Ratings!',
    //     );
    //   }
    //   return result;
    // } catch (error) {
    //   console.error('Error creating review:', error);
    //   if (error instanceof AppError) {
    //     throw error;
    //   }
    //   throw new AppError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     'An unexpected error occurred while creating the review.',
    //   );
    // }
});
const getAllReviewByBusinessQuery = (query, businessId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new QueryBuilder_1.default(ratings_model_1.Review.find({ businessId }).populate('businessId').populate('customerId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { meta, result };
});
const getSingleReviewQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield ratings_model_1.Review.findById(id);
    if (!review) {
        throw new AppError_1.default(404, 'Review Not Found!!');
    }
    const result = yield ratings_model_1.Review.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (result.length === 0) {
        throw new AppError_1.default(404, 'Review not found!');
    }
    return result[0];
});
const updateReviewQuery = (id, payload, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !customerId) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const result = yield ratings_model_1.Review.findOneAndUpdate({ _id: id, customerId: customerId }, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Review Not Found or Unauthorized Access!');
    }
    return result;
});
const deletedReviewQuery = (id, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!id || !customerId) {
    //   throw new AppError(400, 'Invalid input parameters');
    // }
    // const result = await Review.findOneAndDelete({
    //   _id: id,
    //   customerId: customerId,
    // });
    // if (!result) {
    //   throw new AppError(404, 'Review Not Found!');
    // }
    // const business = await Business.findById(result.businessId);
    // if (!business) {
    //   throw new AppError(404, 'Business not found!');
    // }
    // const { reviewCount, ratings } = business;
    // // console.log('reviewCount ratingCount', reviewCount, ratings);
    // // console.log('result.rating', result.rating);
    // const newRatingCount = ratings - result.rating;
    // // console.log('newRatingCount', newRatingCount);
    // const newReviewCount = reviewCount - 1;
    // // console.log('newReviewCount', newReviewCount);
    // let newAverageRating = 0;
    // // console.log('newAverageRating', newAverageRating);
    // if (newReviewCount > 0) {
    //   newAverageRating = newRatingCount / newReviewCount;
    // }
    // if (newReviewCount <= 0) {
    //   newAverageRating = 0;
    // }
    // // console.log('newAverageRating-2', newAverageRating);
    // const updateRatings = await Business.findByIdAndUpdate(
    //   business._id,
    //   {
    //     reviewCount: newReviewCount,
    //     ratings: newAverageRating,
    //   },
    //   { new: true },
    // );
    // if (!updateRatings) {
    //   throw new AppError(500, 'Failed to update Business Ratings!');
    // }
    // return result;
});
exports.reviewService = {
    createReviewService,
    getAllReviewByBusinessQuery,
    getSingleReviewQuery,
    updateReviewQuery,
    deletedReviewQuery,
};
