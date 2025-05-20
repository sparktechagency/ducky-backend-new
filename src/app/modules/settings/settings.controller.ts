import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import httpStatus from 'http-status';

const addSetting = catchAsync(async (req, res) => {
  const settingData = {
    privacyPolicy: '',
    aboutUs: '',
    support: '',
    termsOfService: '',
  };
  const result = await settingsService.addSettings(settingData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Setting added successfully',
    data: result,
  });
});

const getSettings = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await settingsService.getSettings();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Setting get successfully',
      data: result,
    });
  },
);

const updateSetting = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  const settingData = { ...req.body };
  const result = await settingsService.updateSettings(settingData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Setting update successfully',
    data: result,
  });
});

export const settingsController = {
  addSetting,
  updateSetting,
  getSettings,
};
