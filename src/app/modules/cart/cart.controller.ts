import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { cartService } from './cart.service';
import AppError from '../../error/AppError';

const createCart = catchAsync(async (req, res) => {
  const cartData = req.body;
  const {userId} = req.user;
  cartData.userId = userId;



  const result = await cartService.createCartService(cartData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Product Added Successfully!',
    data: result,
  });
});

const getAllCart = catchAsync(async (req, res) => {
    const {userId} = req.user;
  const result = await cartService.getAllCartQuery(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All Cart are requered successful!!',
  });
});

const singleCartProductQuantityUpdate = catchAsync(async (req, res) => {
  const { id, action } = req.params;

  console.log('id', id);
  console.log('action', action);

   if (action !== 'increment' && action !== 'decrement') {
     throw new AppError(400, "Invalid action. Use 'increment' or 'decrement'.")
   }

  const result = await cartService.singleCartProductQuantityUpdateQuery(
    id,
    action,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Cart Product Quantity Increment successful!!',
  });
});

const deleteSingleCart = catchAsync(async (req, res) => {
  const result = await cartService.deletedCartQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Cart are successful!!',
  });
});

export const cartController = {
  createCart,
  getAllCart,
  singleCartProductQuantityUpdate,
  deleteSingleCart,
};
