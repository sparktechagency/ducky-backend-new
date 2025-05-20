import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';

import settingsRouter from '../modules/settings/setting.route';
import notificationRoutes from '../modules/notification/notification.route';
import paymentRouter from '../modules/payment/payment.route';
// import walletRouter from '../modules/wallet/wallet.route';
import withdrawRouter from '../modules/withdraw/withdraw.route';
import reviewRouter from '../modules/ratings/ratings.route';
import chatRouter from '../modules/chat/chat.route';
import messageRouter from '../modules/message/message.route';
import productRouter from '../modules/product/product.route';
import orderRouter from '../modules/orders/orders.route';
import favoriteProductRoutes from '../modules/favorite/favorite.route';
import howMadeRouter from '../modules/howMade/howMade.route';
import faqRouter from '../modules/faq/faq.route';
import cartRouter from '../modules/cart/cart.route';
import shippingRouter from '../modules/shipmentApi/shipmentApi.route';
import pickupAddressRouter from '../modules/pickupAddress/pickupAddress.route';
import reportRouter from '../modules/report/report.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },

  {
    path: '/setting',
    route: settingsRouter,
  },
  {
    path: '/notification',
    route: notificationRoutes,
  },
  {
    path: '/favorite-product',
    route: favoriteProductRoutes,
  },
  // {
  //   path: '/wallet',
  //   route: walletRouter,
  // },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/withdraw',
    route: withdrawRouter,
  },

  {
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/chat',
    route: chatRouter,
  },
  {
    path: '/message',
    route: messageRouter,
  },
  {
    path: '/product',
    route: productRouter,
  },
  {
    path: '/cart',
    route: cartRouter,
  },
  {
    path: '/order',
    route: orderRouter,
  },
  {
    path: '/how-made',
    route: howMadeRouter,
  },
  {
    path: '/faq',
    route: faqRouter,
  },
  {
    path: '/shipping',
    route: shippingRouter,
  },
  {
    path: '/pickup-address',
    route: pickupAddressRouter,
  },
  {
    path: '/report',
    route: reportRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
