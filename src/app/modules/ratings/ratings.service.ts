import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import { TReview } from './ratings.interface';
import { Review } from './ratings.model';
// import Business from '../business/business.model';

const createReviewService = async (payload: TReview) => {
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
};

const getAllReviewByBusinessQuery = async (
  query: Record<string, unknown>,
  businessId: string,
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ businessId }).populate('businessId').populate('customerId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { meta, result };
};

const getSingleReviewQuery = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(404, 'Review Not Found!!');
  }
  const result = await Review.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (result.length === 0) {
    throw new AppError(404, 'Review not found!');
  }

  return result[0];
};

const updateReviewQuery = async (
  id: string,
  payload: Partial<TReview>,
  customerId: string,
) => {
  if (!id || !customerId) {
    throw new AppError(400, 'Invalid input parameters');
  }

  const result = await Review.findOneAndUpdate(
    { _id: id, customerId: customerId },
    payload,
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(404, 'Review Not Found or Unauthorized Access!');
  }
  return result;
};

const deletedReviewQuery = async (id: string, customerId: string) => {
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
};

export const reviewService = {
  createReviewService,
  getAllReviewByBusinessQuery,
  getSingleReviewQuery,
  updateReviewQuery,
  deletedReviewQuery,
};
