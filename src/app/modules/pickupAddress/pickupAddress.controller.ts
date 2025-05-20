import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { pickupAddressService } from './pickupAddress.service';

const addPickupAddress = catchAsync(async (req, res) => {
  const pickupData = {
    zip_code: "6003 DD",
  street_name: "Marconilaan",
  state_code: "FL",
  phone_number: "15479655248",
  locality: "Weert",
  house_number: "8",
  given_name: "First name",
  family_name: "Last name",
  email_address: "info@examplebusiness.com",
  country: "NL",
  business: "Example Business Ltd",
  address2: "Appartment 4D",
  };


  const result = await pickupAddressService.addPickupAddress(pickupData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pickup Address added successfully',
    data: result,
  });
});

const getPickupAddresss = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await pickupAddressService.getPickaddPickupAddress();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Pickup Address get successfully!!',
      data: result,
    });
  },
);

const updatePickupAddress = catchAsync(async (req, res) => {
  //   const { id } = req.params;
  const pickupAddressData = { ...req.body };
  const result =
    await pickupAddressService.updatePickaddPickupAddress(pickupAddressData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pickup Address update successfully',
    data: result,
  });
});

export const pickupAddressController = {
  addPickupAddress,
  updatePickupAddress,
  getPickupAddresss,
};
