import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { TPickupAddress } from './pickupAddress.interface';
import PickupAddress from './pickupAddress.model';
import client from '../../utils/redis';

const addPickupAddress = async (
  data: Partial<TPickupAddress>,
): Promise<TPickupAddress> => {
  const existingPickaddPickupAddress = await PickupAddress.findOne({});
  if (existingPickaddPickupAddress) {
    return existingPickaddPickupAddress;
  } else {
    const result = await PickupAddress.create(data);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add music');
    }
    return result;
  }
};


const getPickaddPickupAddress = async (
) => {
//   const cacheKey = 'pickup_address';
//   const cachedResult = await client.get(cacheKey);

//   if (cachedResult) {
//     return JSON.parse(cachedResult);
//   }
  const result = await PickupAddress.findOne();
//   await client.setEx(cacheKey, 60, JSON.stringify(result)); // Cache for 60 seconds

  return result;
};



const updatePickaddPickupAddress = async (
  payload:any
)=> {
  const result = await PickupAddress.findOneAndUpdate(
    {},
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const pickupAddressService = {
  addPickupAddress,
  updatePickaddPickupAddress,
  getPickaddPickupAddress,
};
