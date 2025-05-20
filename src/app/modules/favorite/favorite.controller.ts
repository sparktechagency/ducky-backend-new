// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { favoriteProductService } from './favorite.service';

const createFavoriteProduct = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const { message, data } =
    await favoriteProductService.createOrDeleteFavoriteProduct(
      req.body,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: data,
    message: message,
  });
});

const getAllFavoriteProductByUser = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await favoriteProductService.getAllFavoriteProductByUserQuery(
    req.query,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Favorite Product All are requered successful!!',
  });
});

// const deletedFavoriteProduct = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.user;
//   const result = await FavoriteProductService.deleteFavoriteProduct(req.params.id, userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'deleted successful',
//   });
// });

export const favoriteProductController = {
  createFavoriteProduct,
  getAllFavoriteProductByUser,
  // deletedFavoriteProduct,
};
