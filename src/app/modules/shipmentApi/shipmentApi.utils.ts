import axios from 'axios';
import config from '../../config';
import AppError from '../../error/AppError';
import Product from '../product/product.model';

const apiKey = '7EyVLQIcx2Ul6PISQaTba0Mr96geTdP6';

export const wearewuunderApiRequest = async (
  endpoint: any,
  method = 'GET',
  data = {},
) => {
  const baseUrl = 'https://api.wearewuunder.com/api/v2';
  //  const baseUrl = 'https://api-playground.wearewuunder.com/api/v2';
  const url = `${baseUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  try {
    const response = await axios({
      url,
      method: method.toUpperCase(),
      //  headers: getAuthHeader(),
      headers: {
        Authorization: `Bearer ${config.shipment_key}`,
        'Content-Type': 'application/json',
      },
      data: method.toUpperCase() === 'GET' ? null : data,
    });

    console.log('response==', response);

    return {data:response.data, status:response.status};
  } catch (error: any) {
    if (error.response) {
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data.errors,
        headers: error.response.headers,
        url: url,
        method: method,
        errors: error.response.data.errors.map(
          (errorItem:any) => errorItem.messages,
        ),
        message: error.response.data[0]?.message,
      });


      if (error.response.status === 401) {
        throw new AppError(401, 'Unauthorized');
      }
      if (error.response.status === 404) {
        throw new AppError(404, 'Not found');
      }

      if(error.response.status === 422) {
        console.log('error.response.data', error.response.data);
        console.log(
          'error.response.data.error_details',
          error.response.data.error_details,
        );
        console.log('error.response.data.errors', error.response.data.errors);
      }
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};

export async function calculateShippingBox(products: any) {
  let totalHeight = 0;
  let totalWidth = 0;
  let totalLength = 0;

  const productPromises = products.map(async (product: any) => {
    const productDetails = await Product.findById(product.productId);

    if (productDetails) {
        totalHeight += Number(productDetails.height) * product.quantity;
        totalWidth += Number(productDetails.width) * product.quantity;
        totalLength += Number(productDetails.length) * product.quantity;
    }
  });

  await Promise.all(productPromises);

  console.log('totalHeight', totalHeight);
  console.log('totalWidth', totalWidth);
  console.log('totalLength', totalLength);

  const avgHeight = totalHeight / products.length;
  const avgWidth = totalWidth / products.length;
  const avgLength = totalWidth / products.length;

  return { avgHeight, avgWidth, avgLength };
}