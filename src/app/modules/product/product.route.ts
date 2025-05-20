import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { productController } from './product.controller';


const upload = fileUpload('./public/uploads/products');

const productRouter = express.Router();

productRouter
  .post(
    '/create-product',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    // validateRequest(videoValidation.VideoSchema),
    productController.createProduct,
  )
  .get('/', productController.getAllProduct)
  .get('/:id', auth(USER_ROLE.USER), productController.getSingleProduct)
  .get('/admin/:id', productController.getAdminSingleProduct)
  .patch(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    productController.updateSingleProduct,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    productController.deleteSingleProduct,
  );

export default productRouter;
