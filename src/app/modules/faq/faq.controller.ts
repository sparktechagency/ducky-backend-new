import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { faqService } from './faq.service';

const createFaq = catchAsync(async (req, res) => {
  const payload = req.body;
  
  const result = await faqService.createFaq(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'FAQ Create successful!!',
  });
});

const getAllFaq = catchAsync(async (req, res) => {
  const { meta, result } = await faqService.getAllFaqQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Faq are requered successful!!',
  });
});

const getSingleFaq = catchAsync(async (req, res) => {
  const result = await faqService.getSingleFaqQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Faq are requered successful!!',
  });
});

const updateSingleFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

 

  const result = await faqService.updateSingleFaqQuery(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Faq  are updated successful!!',
  });
});

const deleteSingleFaq = catchAsync(async (req, res) => {
  const result = await faqService.deletedFaqQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Faq are successful!!',
  });
});

export const faqController = {
  createFaq,
  getAllFaq,
  getSingleFaq,
  updateSingleFaq,
  deleteSingleFaq,
};
