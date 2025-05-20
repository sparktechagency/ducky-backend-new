import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import {
  calculateShippingBox,
  wearewuunderApiRequest,
} from './shipmentApi.utils';
import axios from 'axios';
import Cart from '../cart/cart.model';
import Product from '../product/product.model';
import { Order } from '../orders/orders.model';
import { User } from '../user/user.models';
import { ShipmentApi, ShipmentRequestApi } from './shipmentApi.model';
import PickupAddress from '../pickupAddress/pickupAddress.model';
// import Business from '../business/business.model';
import {
  postcodeValidator,
  postcodeValidatorExistsForCountry,
} from 'postcode-validator';


// const apiKey = '7EyVLQIcx2Ul6FISHTba0Mr96geTdP6';
const apiKey = '7EyVLQIcx2Ul6PISQaTba0Mr96geTdP6';

const createShippingService = async (payload: any) => {
  const order = await Order.findById(payload.orderId);
  if (!order) {
    throw new AppError(400, 'Order is not found!');
  }
  const user = await User.findById(order.userId);
  if (!user) {
    throw new AppError(400, 'User is not found!');
  }

  const pickupAddress = await PickupAddress.findOne({});
  if (!pickupAddress) {
    throw new AppError(400, 'Pickup Address is not found!');  
  }
  const heightAndWidthAndLength = await calculateShippingBox(order.productList);

  const productItems = await Promise.all(
    order.productList.map(async (productItem: any) => {
      const product = await Product.findById(productItem.productId);

      if (!product) {
        throw new AppError(400, 'Product not found for this cart item');
      }

      return {
        weight: Number(product.weight),
        value: productItem.price,
        quantity: productItem.quantity,
        description: 'string',
      };
    }),
  );

  // calculateShippingBox(order.productList)
  //   .then((heightAndWidth) => {
  //     console.log('heightAndWidth==', heightAndWidth);
  //   })
  //   .catch((err) => {
  //     console.error('Error calculating shipping box:', err);
  //   });

  // const url = 'https://api.wearewuunder.com/api/v2/bookings';
  console.log('heightAndWidth==', heightAndWidthAndLength);

  const shippingData = {
    width: Math.ceil(heightAndWidthAndLength.avgWidth), 
    pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
    pickup_address: {
      zip_code: pickupAddress.zip_code,
      street_name: pickupAddress.street_name,
      state_code: pickupAddress.state_code,
      phone_number: pickupAddress.phone_number,
      locality: pickupAddress.locality,
      house_number: pickupAddress.house_number,
      given_name: pickupAddress.given_name,
      family_name: pickupAddress.family_name,
      email_address: pickupAddress.email_address,
      country: pickupAddress.country,
      business: pickupAddress.business,
      address2: pickupAddress.address2,
    },
    order_lines: productItems,
    meta: {},
    length: Math.ceil(heightAndWidthAndLength.avgLength), // in centimeters
    kind: 'package',
    is_return: false,
    height: Math.ceil(heightAndWidthAndLength.avgHeight), // in centimeters
    drop_off: false,
    description: 'description',
    delivery_address: {
      zip_code: order.zip_code,
      street_name: order.street_name,
      state_code: order.state_code,
      phone_number: order.phone_number,
      locality: order.locality,
      house_number: order.house_number,
      given_name: order.given_name,
      family_name: order.family_name,
      email_address: user.email,
      country: order.country,
      business: order.business,
      address2: order.address2,
    },
    customer_reference: 'W202301',
  };




  const shipingBooking = await wearewuunderApiRequest(
    'bookings',
    'POST',
    shippingData,
  );


  if (shipingBooking.status === 201) {
    const data = {
      shippingbookingId: shipingBooking.data.id,
    };

    const shipingApi = await ShipmentApi.create(data);

    if (!shipingApi) {
      throw new AppError(400, 'ShipmentApi creqate failed!');
    }

    const order = await Order.findByIdAndUpdate(
      payload.orderId,
      { status: 'received' },
      { new: true },
    );
    if (!order) {
      throw new AppError(400, 'Order is not found!');
    }
  }

  return shipingBooking;
};



const createShippingRequestService = async (id: any) => {

  const completeOrder = await Order.findById(id);
  if (!completeOrder) {
    throw new AppError(400, 'Order is not found!');
  }
  if (completeOrder.paymentStatus !== 'paid') {
    throw new AppError(400, 'Order is not paid!');
  }

  const user = await User.findById(completeOrder.userId);
  if (!user) {
    throw new AppError(400, 'User is not found!');
  }

  const pickupAddress = await PickupAddress.findOne({});
  if (!pickupAddress) {
    throw new AppError(400, 'Pickup Address is not found!');
  }

  // const singleBooking = await wearewuunderApiRequest(`bookings/${id}`, 'GET');


   
   
    const orderItems = await Promise.all(
      completeOrder.productList.map(async (productItem: any) => {
        const product = await Product.findById(productItem.productId);

        if (!product) {
          throw new AppError(400, 'Product not found for this cart item');
        }

        return {
          weight: Number(product.weight),
          value: productItem.price,
          quantity: productItem.quantity,
          description: 'string',
        };
      }),
    );

    // console.log('orderItems====', orderItems);

     const heightAndWidthAndLength = await calculateShippingBox(
       completeOrder.productList,
     );

    const shipmentRequestData = {
      width:
        80 < Math.ceil(heightAndWidthAndLength.avgWidth)
          ? 80
          : Math.ceil(heightAndWidthAndLength.avgWidth), // in centimeters
      // pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
      preferred_service_level: 'any:most_efficient',
      pickup_address: {
        zip_code: pickupAddress.zip_code,
        street_name: pickupAddress.street_name,
        state_code: pickupAddress.state_code,
        phone_number: pickupAddress.phone_number,
        locality: pickupAddress.locality,
        house_number: pickupAddress.house_number,
        given_name: pickupAddress.given_name,
        family_name: pickupAddress.family_name,
        email_address: pickupAddress.email_address,
        country: pickupAddress.country,
        business: pickupAddress.business,
        address2: pickupAddress.address2,
      },
      personal_message: 'A very personal message',
      // parcelshop_id: 'POST_NL:1234',
      order_lines: orderItems,
      meta: {},
      length:
        120 < Math.ceil(heightAndWidthAndLength.avgLength)
          ? 120
          : Math.ceil(heightAndWidthAndLength.avgLength), // in centimeters
      kind: 'package',
      is_return: false,
      height:
        80 < Math.ceil(heightAndWidthAndLength.avgHeight)
          ? 80
          : Math.ceil(heightAndWidthAndLength.avgHeight), // in centimeters
      drop_off: false,
      description: 'description',
      delivery_address: {
        zip_code: completeOrder.zip_code,
        street_name: completeOrder.street_name,
        state_code: completeOrder.state_code,
        phone_number: completeOrder.phone_number,
        locality: completeOrder.locality,
        house_number: completeOrder.house_number,
        given_name: completeOrder.given_name,
        family_name: completeOrder.family_name,
        email_address: user.email,
        country: completeOrder.country,
        business: completeOrder.business,
        address2: completeOrder.address2,
      },
      delivery_instructions: 'delivery instructions',
      customer_reference: 'W202301',
    };

    console.log('shipmentRequestData===========', shipmentRequestData);

    // const requestData = {
    //   width: 30,
    //   weight: 1000,
    //   webhook_url: 'string',
    //   value: 40000,
    //   request_pickup: true,
    //   preferred_service_level: 'post_nl:cheapest',
    //   picture: 'string',
    //   pickup_address: {
    //     zip_code: '6003 DD',
    //     vat: 'NL8559.62.100',
    //     street_name: 'Marconilaan',
    //     state_code: 'FL',
    //     phone_number: '+31683243251',
    //     locality: 'Weert',
    //     house_number: '8',
    //     given_name: 'First name',
    //     family_name: 'Last name',
    //     eori_number: 'NL8559.62.100',
    //     email_address: 'info@examplebusiness.com',
    //     country: 'NL',
    //     business: 'Example Business Ltd.',
    //     address2: 'Appartment 4D',
    //   },
    //   personal_message: 'A very personal message',
    //   parcelshop_id: 'POST_NL:1234',
    //   ordered_at: '2024-04-11T16:44:21.013152',
    //   order_lines: [
    //     {
    //       weight: 1000,
    //       value: '5.99',
    //       sku: '54321',
    //       quantity: 1,
    //       hs_code: '1234567890',
    //       ean: '12345',
    //       description: 'string',
    //       country_of_origin: 'NL',
    //     },
    //   ],
    //   number_of_items: 1,
    //   meta: {},
    //   length: 40,
    //   kind: 'package',
    //   is_return: false,
    //   incoterms: 'DDP',
    //   height: 20,
    //   drop_off: false,
    //   description: '1x API documentation',
    //   delivery_address: {
    //     zip_code: '6003 DD',
    //     vat: 'NL8559.62.100',
    //     street_name: 'Marconilaan',
    //     state_code: 'FL',
    //     phone_number: '+31683243251',
    //     locality: 'Weert',
    //     house_number: '8',
    //     given_name: 'First name',
    //     family_name: 'Last name',
    //     eori_number: 'NL8559.62.100',
    //     email_address: 'info@examplebusiness.com',
    //     country: 'NL',
    //     business: 'Example Business Ltd.',
    //     address2: 'Appartment 4D',
    //   },
    //   deliver_by: '2023-02-29',
    //   customer_reference: 'W202301',
    // };

    // const shipmentRequestBooking = await wearewuunderApiRequest(
    //   'shipments',
    //   'POST',
    //   shipmentRequestData,
    // );

     try {
                 const  shipmentRequestBooking = await axios.post(
                    'https://api.wearewuunder.com/api/v2/shipments',
                    shipmentRequestData,
                    {
                      headers: {
                        // Authorization: `Bearer ${config.shipment_key}`,
                        Authorization: `Bearer 7EyVLQIcx2Ul6PISQaTba0Mr96geTdP6`,
                        'Content-Type': 'application/json',
                      },
                    },
                  );
    
                  console.log('shipmentRequestBooking', shipmentRequestBooking);
    
                  if (shipmentRequestBooking.status === 201) {
                    const data = {
                      shipmentRequestId: shipmentRequestBooking.data.id,
                    };
    
                    const shipingApi = await ShipmentRequestApi.create(data);
                    console.log('shipingApi', shipingApi);
                    const order = await Order.findByIdAndUpdate(
                      id,
                      {
                        trackUrl:
                          shipmentRequestBooking.data.track_and_trace_url,
                          error:'false'
                      },
                      { new: true },
                    );
    
                    if (!order) {
                      throw new AppError(httpStatus.BAD_REQUEST, 'Order not found');
                    }
    
                    if (!shipingApi) {
                      throw new AppError(400, 'ShipmentRequestApi creqate failed!');
                    }
                  }
    
                  return shipmentRequestBooking?.data;
                } catch (error:any) {
                  console.log('error==', error);
    
                  console.error('Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                    // url: url,
                    // method: method,
                    // errors: error.response.data.errors.map(
                    //   (errorItem: any) => errorItem.messages,
                    // ),
                    message: error.response.data[0]?.message,
                  });
    
    
                  if(error){
                    const order = await Order.findByIdAndUpdate(
                      id,
                      { error: error.response.data[0]?.message },
                      { new: true },
                    );
                  }
                  return error.response;
                  
                }

  
};

const getAllBookingShippingRequestQuery = async () => {

  const allIds = await ShipmentRequestApi.find();
  const ids = allIds.map((item) => item.shipmentRequestId);

  if (!ids || ids.length === 0) {
    throw new AppError(400, 'ShipmentRequestApi not found!');
  }
  
  const bookingPromises = ids.map(async (id: any) => {
    const singleBooking = await wearewuunderApiRequest(
      `shipments/${id}`,
      'GET',
    );
    return singleBooking.data;
  });

  const allBookingsRequest = await Promise.all(bookingPromises);

  return allBookingsRequest;
};


const createShippingRatesService = async (payload: any) => {
  const isValid = postcodeValidator(payload.zip_code, payload.country);
  // console.log('isValid================', isValid);
  // console.log('dsfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1');

  if (!isValid) {
    throw new AppError(400, 'Zip code is not valid!');
  }
  // console.log('dsfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-2');
  const isValidCountry = postcodeValidatorExistsForCountry(payload.country);

  if (!isValidCountry) {
    throw new AppError(400, 'Country is not valid!');
  }

  function validateDutchPostalCode(postalCode: string) {
  const regex = /^[1-9]\d{3}\s?(?:[A-PR-TV-Z][A-Z]|S[BCE-RT-Z])$/i;
    return regex.test(postalCode);
  };

  if (!validateDutchPostalCode(payload.zip_code)) {
    throw new AppError(404, 'Zip code is not valid for this country!');
  }
 

  const productItems = await Promise.all(
    payload.cartIds.map(async (cartId: any) => {
      const cartProduct = await Cart.findById(cartId);

      if (!cartProduct) {
        throw new AppError(400, 'Cart is not found!');
      }

      const product = await Product.findById(cartProduct.productId);
      console.log('product===', product);

      if (!product) {
        throw new AppError(400, 'Product not found for this cart item');
      }

      return {
        weight: Number(product.weight),
        value: cartProduct.price,
        quantity: cartProduct.quantity,
        description: 'string',
      };
    }),
  );

  const pickupAddress = await PickupAddress.findOne({});
  if (!pickupAddress) {
    throw new AppError(400, 'Pickup Address is not found!');
  }

  const productList = await Promise.all(
    payload.cartIds.map(async (cartId: any) => {
      const cartProduct = await Cart.findById(cartId);

      if (!cartProduct) {
        throw new AppError(400, 'Cart is not found!');
      }

      const product = await Product.findById(cartProduct.productId);

      if (!product) {
        throw new AppError(400, 'Product not found for this cart item');
      }

      return {
        productId: product._id,
        quantity: cartProduct.quantity,
        name: product.name,
        height: Number(product.height),
        width: Number(product.width),
        length: Number(product.length),
      };
    }),
  );
  const heightAndWidthAndLength = await calculateShippingBox(productList);

  console.log('productItems', productItems);

  // const url = 'https://api.wearewuunder.com/api/v2/bookings/rates';

  const shippingData = {
    width:
      80 < Math.ceil(heightAndWidthAndLength.avgWidth)
        ? 80
        : Math.ceil(heightAndWidthAndLength.avgWidth), // in centimeters
    // weight: 1000, // in grams
    // webhook_url: 'string',
    // value: 40000, // value in eurocents (e.g., €400.00)
    // redirect_url: 'string',
    // preferred_service_level: 'post_nl:cheapest',
    // picture: 'string',
    // pickup_date: '2019-08-24T14:15:22Z', // ISO 8601 format, UTC
    pickup_address: {
      zip_code: pickupAddress.zip_code,
      street_name: pickupAddress.street_name,
      state_code: pickupAddress.state_code,
      phone_number: pickupAddress.phone_number,
      locality: pickupAddress.locality,
      house_number: pickupAddress.house_number,
      given_name: pickupAddress.given_name,
      family_name: pickupAddress.family_name,
      email_address: pickupAddress.email_address,
      country: pickupAddress.country,
      business: pickupAddress.business,
      address2: pickupAddress.address2,
    },
    // personal_message: 'A very personal message',
    // parcelshop_id: 'POST_NL:1234',
    order_lines: productItems,
    meta: {},
    length:
      120 < Math.ceil(heightAndWidthAndLength.avgLength)
        ? 120
        : Math.ceil(heightAndWidthAndLength.avgLength), // in centimeters
    kind: 'package',
    is_return: false,
    incoterms: 'DDP',
    height:
      80 < Math.ceil(heightAndWidthAndLength.avgHeight)
        ? 80
        : Math.ceil(heightAndWidthAndLength.avgHeight), // in centimeters
    drop_off: false,
    description: 'string',
    delivery_address: {
      zip_code: payload.zip_code,
      street_name: payload.street_name,
      state_code: payload.state_code,
      phone_number: payload.phone_number,
      locality: payload.locality,
      house_number: payload.house_number,
      given_name: payload.given_name,
      family_name: payload.family_name,
      // email_address: payload.email_address,
      country: payload.country,
      business: payload.business,
      address2: payload.address2,
    },
    customer_reference: 'W202301',
  };

  console.log('shippingData=======', shippingData);
  let result;

  try {
    result = await axios.post(
      'https://api.wearewuunder.com/api/v2/bookings/rates',
      shippingData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log('resulet ======', result);

    console.log('shipingRates==result', result);
  } catch (error: any) {
    if (error.response.status === 422) {
      throw new AppError(403, 'Your Information is not Valid');
    }
  }

  // const shipingRates = await wearewuunderApiRequest(
  //   'bookings/rates',
  //   'POST',
  //   shippingData,
  // );

  // console.log('shipingRates====', shipingRates);

  // return shipingRates.rates;

  return result?.data?.rates;
};





const getAllBookingShippingQuery = async () => {

  const newData = await ShipmentApi.find();
  const ids = newData.map((item: any) => item.shippingbookingId);

  if (!ids || ids.length === 0) {
    throw new AppError(403, 'Invalid input parameters: No IDs provided');
  }

  const bookingPromises = ids.map(async (id:any) => {
    const singleBooking = await wearewuunderApiRequest(`bookings/${id}`, 'GET');
    return singleBooking.data;
  });

  const allBookings = await Promise.all(bookingPromises);

  return allBookings;
};

const getSingleShippingQuery = async (id: string) => {
  console.log('id', id);
  const singleBooking = await wearewuunderApiRequest(`bookings/${id}`, 'GET');

  console.log('singleBooking==', singleBooking);

  if (!singleBooking) {
    throw new AppError(404, 'Booking Not Found!!');
  }

  return singleBooking.data;
};

const deletedShippingQuery = async (id: string) => {
  const shipmentApi = await ShipmentApi.findOne({
    shippingbookingId: id,
  });

  if (!shipmentApi) {
    throw new AppError(404, 'Booking Id is Not Found!!');
  }

    const singleBooking = await wearewuunderApiRequest(
      `bookings/${id}`,
      'DELETE',
    );

    if (singleBooking.status === 204) {
      const deleted = await ShipmentApi.findOneAndDelete({
        shippingbookingId: id,
      });

      if (!deleted) {
        throw new AppError(404, 'Booking Deletion Failed in Local Database!');
      }
    } else {
      throw new AppError(500, 'Failed to delete the booking from Wuunder');
    }
  
  return null;
};

export const shippingService = {
  createShippingService,
  createShippingRequestService,
  createShippingRatesService,
  getAllBookingShippingQuery,
  getAllBookingShippingRequestQuery,
  getSingleShippingQuery,
  deletedShippingQuery,
};
