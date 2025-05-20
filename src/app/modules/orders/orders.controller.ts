import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { orderService } from './orders.service';



const getAllOrder = catchAsync(async (req, res) => {
  const { meta, result } = await orderService.getAllOrderQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Order are requered successful!!',
  });
});

const getAllOrderByUser = catchAsync(async (req, res) => {
    const {userId} = req.user;
    const query:any = req.query;
    // if(query.error === "true"){
    //     delete query.error
    //     query.error = null
    // }
  const { meta, result } = await orderService.getAllOrderByUserQuery(
    userId,
    query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'My All Order are requered successful!!',
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const result = await orderService.getSingleOrderQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Order are requered successful!!',
  });
});

const updateSingleOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const status = req.query.status;

  const result = await orderService.updateSingleOrderStatusQuery(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Order status are updated successful!!',
  });
});

const deleteSingleOrder = catchAsync(async (req, res) => {
  const result = await orderService.deletedOrderQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Order are successful!!',
  });
});

const updateSingleOrderByAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await orderService.updateOrderByAdminQuery(
    req.params.id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Updated Single Order are successful!!',
  });
});

export const orderController = {
  getAllOrder,
  getAllOrderByUser,
  getSingleOrder,
  updateSingleOrderStatus,
  updateSingleOrderByAdmin,
  deleteSingleOrder,
};
