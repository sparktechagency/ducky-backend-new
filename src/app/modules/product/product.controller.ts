import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { productService } from './product.service';
import Product from './product.model';
import AppError from '../../error/AppError';

const createProduct = catchAsync(async (req, res) => {

  console.log('hit hoise');
  const productData = req.body;
  const isExist = await Product.findOne({
    name: productData.name,
  });
  if (isExist) {
    throw new AppError(400, 'Product already exist !');
  }
  productData.availableStock = productData.stock;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  
  if (imageFiles?.images && imageFiles.images.length > 0) {
    productData.images = imageFiles.images.map((file) =>
      file.path.replace(/^public[\\/]/, ''),
    );
  }

  if (imageFiles?.coverImage && imageFiles.coverImage.length > 0) {
    productData.coverImage = imageFiles.coverImage[0].path.replace(
      /^public[\\/]/,
      '',
    );
    
  }


  const result = await productService.createProductService(productData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added successfully!',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const { meta, result } = await productService.getAllProductQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Product are requered successful!!',
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
    const {userId} = req.user;
  const result = await productService.getSingleProductQuery(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Product are requered successful!!',
  });
});
const getAdminSingleProduct = catchAsync(async (req, res) => {
  const result = await productService.getAdminSingleProductQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Admin Product are requered successful!!',
  });
});

const updateSingleProduct = catchAsync(async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      throw new AppError(400, 'Product not found !');
    }
    const updateData = req.body;
      let remainingUrl = updateData?.remainingUrl || null;
    const imageFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (imageFiles?.images && imageFiles.images.length > 0) {
      updateData.images = imageFiles.images.map((file) =>
        file.path.replace(/^public[\\/]/, ''),
      );
    }
      if (imageFiles?.coverImage && imageFiles.coverImage.length > 0) {
        updateData.coverImage = imageFiles.coverImage[0].path.replace(
          /^public[\\/]/,
          '',
        );
      }
     if (remainingUrl) {
       if (!updateData.images) {
         updateData.images = [];
       }
       updateData.images = [...updateData.images, remainingUrl];
     }

    if(updateData.images && !remainingUrl){
      updateData.images = [...updateData.images];

    }
    
    if (updateData.price) {
      updateData.price = Number(updateData.price);
      
    }
    if (updateData.availableStock) {
      updateData.availableStock = Number(updateData.availableStock);
      const differentStock = Math.abs(
        Number(product.availableStock) - Number(updateData.availableStock),
      );
      if (differentStock !== 0) {
        updateData.stock = updateData.stock + differentStock;
      }
    }

    console.log('updateData', updateData);

     

  const result = await productService.updateSingleProductQuery(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Product are updated successful!!',
  });
});

const deleteSingleProduct = catchAsync(async (req, res) => {
  const result = await productService.deletedProductQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Product are successful!!',
  });
});

export const productController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  getAdminSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
};
