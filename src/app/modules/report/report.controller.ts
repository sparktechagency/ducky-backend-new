import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { reportService } from './report.service';

const createReport = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await reportService.createReport(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Report Create successful!!',
  });
});

const getAllReport = catchAsync(async (req, res) => {
  const { meta, result } = await reportService.getAllReportQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Report are requered successful!!',
  });
});



export const reportController = {
  createReport,
  getAllReport,
};
