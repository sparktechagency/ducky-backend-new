import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { shippingService } from './shipmentApi.service';

const createShipping = catchAsync(async (req, res) => {
  const shippingData = req.body;
  const result = await shippingService.createShippingService(shippingData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Order added successfully!',
    data: result,
  });
});


const createShippingRequest = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await shippingService.createShippingRequestService(id);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Request Create SuccessFull!',
    data: result,
  });
});


const createShippingRates = catchAsync(async (req, res) => {
  const shippingData = req.body;
  const result = await shippingService.createShippingRatesService(shippingData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping Order added successfully!',
    data: result,
  });
});

const getAllShipping = catchAsync(async (req, res) => {
  const result = await shippingService.getAllBookingShippingQuery();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All Shipping are requered successful!!',
  });
});


const getAllShippingRequest = catchAsync(async (req, res) => {
  const result = await shippingService.getAllBookingShippingRequestQuery();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: meta,
    data: result,
    message: ' All Shipping Request are requered successful!!',
  });
});

const getSingleShipping = catchAsync(async (req, res) => {
  const result = await shippingService.getSingleShippingQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Shipping are requered successful!!',
  });
});



const deleteSingleShipping = catchAsync(async (req, res) => {
  const result = await shippingService.deletedShippingQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Shipping are successful!!',
  });
});

export const shippingController = {
  createShipping,
  createShippingRequest,
  createShippingRates,
  getAllShipping,
  getAllShippingRequest,
  getSingleShipping,
  deleteSingleShipping,
};
