import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { reviewService } from './ratings.service';

const createReview = catchAsync(async (req, res) => {
  const reviewData = req.body;
  const { userId } = req.user;
  // console.log({ userId });
  reviewData.customerId = userId;

  const result = await reviewService.createReviewService(reviewData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully!',
    data: result,
  });
});

const getReviewByCustomer = catchAsync(async (req, res) => {
  const { businessId }: any = req.query;
  const { meta, result } = await reviewService.getAllReviewByBusinessQuery(
    req.query,
    businessId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Review are requered successful!!',
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const result = await reviewService.getSingleReviewQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Review are requered successful!!',
  });
});

const updateSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const updateData = req.body;
  const result = await reviewService.updateReviewQuery(id, updateData, userId);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully!',
    data: result,
  });
});

const deleteSingleReview = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await reviewService.deletedReviewQuery(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Review are successful!!',
  });
});

export const reviewController = {
  createReview,
  getReviewByCustomer,
  getSingleReview,
  updateSingleReview,
  deleteSingleReview,
};
