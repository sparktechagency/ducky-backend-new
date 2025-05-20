"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.stripe = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const payment_model_1 = require("./payment.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const stripe_1 = __importDefault(require("stripe"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../product/product.model"));
const orders_model_1 = require("../orders/orders.model");
const notification_service_1 = require("../notification/notification.service");
const cart_model_1 = __importDefault(require("../cart/cart.model"));
// console.log({ first: config.stripe.stripe_api_secret });
exports.stripe = new stripe_1.default(config_1.default.stripe.stripe_api_secret);
// console.log('stripe==', stripe);
const addPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    // console.log('payment data', payload);
    try {
        // console.log('console.log-1');
        const newPayload = {};
        console.log('payload==', payload);
        const user = yield user_models_1.User.findById(payload.userId).session(session);
        if (!user) {
            throw new AppError_1.default(400, 'User is not found!');
        }
        if (user.role !== 'user') {
            throw new AppError_1.default(400, 'User is not authorized as a User!!');
        }
        newPayload.orderDate = new Date();
        const productlist = yield Promise.all(payload.cartIds.map((cartId) => __awaiter(void 0, void 0, void 0, function* () {
            // const singleProduct = await Product.findById(product.productId).session(
            //   session,
            // );
            const cartItem = yield cart_model_1.default.findById(cartId).session(session);
            if (!cartItem) {
                throw new AppError_1.default(404, 'Cart is not Found!!');
            }
            const singleProduct = yield product_model_1.default.findById(cartItem.productId).session(session);
            if (!singleProduct) {
                throw new AppError_1.default(404, 'Product is not Found!!');
            }
            console.log('singleProduct==availableStock', singleProduct.availableStock);
            console.log('cartItem.quantity', cartItem.quantity);
            if (Number(singleProduct.availableStock) < cartItem.quantity) {
                throw new AppError_1.default(403, 'Insufficient stock for the product!');
            }
            return {
                productId: cartItem.productId,
                price: cartItem.price * cartItem.quantity,
                quantity: cartItem.quantity,
            };
        })));
        newPayload.productList = productlist;
        newPayload.userId = payload.userId;
        newPayload.phone_number = payload.phone_number;
        newPayload.zip_code = payload.zip_code;
        newPayload.street_name = payload.street_name;
        newPayload.state_code = payload.state_code;
        newPayload.locality = payload.locality;
        newPayload.house_number = payload.house_number;
        newPayload.given_name = payload.given_name;
        newPayload.family_name = payload.family_name;
        newPayload.country = payload.country;
        newPayload.address2 = payload.address2;
        newPayload.business = payload.business;
        const totalAmount = productlist.reduce((acc, product) => acc + product.price, 0);
        newPayload.totalAmount = totalAmount;
        if (!payload.shippingCost) {
            throw new AppError_1.default(400, 'Shipping cost is required!');
        }
        else {
            payload.shippingCost = Number(payload.shippingCost);
        }
        newPayload.totalAmount = newPayload.totalAmount + payload.shippingCost;
        console.log('newPayload with totalAmount==', newPayload);
        const order = yield orders_model_1.Order.create([newPayload], { session });
        if (!order[0]) {
            throw new AppError_1.default(400, 'Failed to create order!');
        }
        const paymentInfo = {
            orderId: order[0]._id,
            amount: order[0].totalAmount + payload.shippingCost,
            cartIds: payload.cartIds,
        };
        console.log('======stripe payment', paymentInfo);
        const checkoutResult = yield createCheckout(payload.userId, paymentInfo);
        if (!checkoutResult) {
            throw new AppError_1.default(400, 'Failed to create checkout session!');
        }
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return checkoutResult;
    }
    catch (error) {
        console.error('Transaction Error:', error);
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllPaymentService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find({}).populate('userId').populate('orderId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield PaymentQuery.modelQuery;
    const meta = yield PaymentQuery.countTotal();
    return { meta, result };
});
const getAllPaymentByCustomerService = (query, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find({ customerId, status: 'paid' }).populate({
        path: 'serviceId',
        select: 'serviceName servicePrice',
        populate: { path: 'businessId', select: 'businessName' },
    }), 
    // .populate('businessId'),
    query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield PaymentQuery.modelQuery;
    const meta = yield PaymentQuery.countTotal();
    return { meta, result };
});
const singlePaymentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield payment_model_1.Payment.findById(id);
    return task;
});
const deleteSinglePaymentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.deleteOne({ _id: id });
    return result;
});
const getAllIncomeRatio = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalIncome: 0,
    }));
    // console.log({ months });
    const incomeData = yield payment_model_1.Payment.aggregate([
        {
            $match: {
                transactionDate: { $gte: startOfYear, $lt: endOfYear },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$transactionDate' } },
                totalIncome: { $sum: '$amount' },
            },
        },
        {
            $project: {
                month: '$_id.month',
                totalIncome: 1,
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
    ]);
    incomeData.forEach((data) => {
        const monthData = months.find((m) => m.month === data.month);
        if (monthData) {
            monthData.totalIncome = data.totalIncome;
        }
    });
    // console.log({ months });
    return months;
});
// const getAllIncomeRatiobyDays = async (days: string) => {
//   const currentDay = new Date();
//   let startDate: Date;
//   if (days === '7day') {
//     startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
//   } else if (days === '24hour') {
//     startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
//   } else {
//     throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
//   }
//   const timeSlots =
//     days === '7day'
//       ? Array.from({ length: 7 }, (_, i) => {
//           const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
//           return {
//             date: day.toISOString().split('T')[0],
//             totalIncome: 0,
//           };
//         }).reverse()
//       : Array.from({ length: 24 }, (_, i) => {
//           const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
//           return {
//             hour: hour.toISOString(),
//             totalIncome: 0,
//           };
//         }).reverse();
//   const incomeData = await Payment.aggregate([
//     {
//       $match: {
//         transactionDate: { $gte: startDate, $lte: currentDay },
//       },
//     },
//     {
//       $group: {
//         _id:
//           days === '7day'
//             ? {
//                 date: {
//                   $dateToString: {
//                     format: '%Y-%m-%d',
//                     date: '$transactionDate',
//                   },
//                 },
//               }
//             : {
//                 hour: {
//                   $dateToString: {
//                     format: '%Y-%m-%dT%H:00:00',
//                     date: '$transactionDate',
//                   },
//                 },
//               },
//         totalIncome: { $sum: '$amount' },
//       },
//     },
//     // {
//     //   $project: {
//     //     dateHour: days === '7day' ? '$_id.date' : null,
//     //     dateHour: days === '24hour' ? '$_id.hour' : null,
//     //     totalIncome: 1,
//     //     _id: 0,
//     //   },
//     // },
//     {
//   $project: {
//     dateHour: {
//       $cond: {
//         if: { $eq: [days, '7day'] },
//         then: '$_id.date', // For 7day, use the date field
//         else: '$_id.hour', // For 24hour, use the hour field
//       },
//     },
//     totalIncome: 1,
//     _id: 0,
//   },
// },
//     {
//       $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
//     },
//   ]);
//   incomeData.forEach((data) => {
//     if (days === '7day') {
//       const dayData = timeSlots.find((d: any) => d.date === data.date);
//       if (dayData) {
//         dayData.totalIncome = data.totalIncome;
//       }
//     } else if (days === '24hour') {
//       const hourData = timeSlots.find((h: any) => h.hour === data.hour);
//       if (hourData) {
//         hourData.totalIncome = data.totalIncome;
//       }
//     }
//   });
//   return timeSlots;
// };
const getAllIncomeRatiobyDays = (days) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDay = new Date();
    let startDate;
    if (days === '7day') {
        startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    else if (days === '24hour') {
        startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
    }
    else {
        throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
    }
    const timeSlots = days === '7day'
        ? Array.from({ length: 7 }, (_, i) => {
            const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
            return {
                dateHour: day.toISOString().split('T')[0],
                totalIncome: 0,
            };
        }).reverse()
        : Array.from({ length: 24 }, (_, i) => {
            const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
            return {
                dateHour: hour.toISOString(),
                totalIncome: 0,
            };
        }).reverse();
    const incomeData = yield payment_model_1.Payment.aggregate([
        {
            $match: {
                transactionDate: { $gte: startDate, $lte: currentDay },
            },
        },
        {
            $group: {
                _id: days === '7day'
                    ? {
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$transactionDate',
                            },
                        },
                    }
                    : {
                        hour: {
                            $dateToString: {
                                format: '%Y-%m-%dT%H:00:00',
                                date: '$transactionDate',
                            },
                        },
                    },
                totalIncome: { $sum: '$amount' },
            },
        },
        {
            $project: {
                dateHour: days === '7day' ? '$_id.date' : '$_id.hour', // Rename to 'dateHour'
                totalIncome: 1,
                _id: 0,
            },
        },
        {
            $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
        },
    ]);
    incomeData.forEach((data) => {
        if (days === '7day') {
            const dayData = timeSlots.find((d) => d.dateHour === data.dateHour);
            if (dayData) {
                dayData.totalIncome = data.totalIncome;
            }
        }
        else if (days === '24hour') {
            const hourData = timeSlots.find((h) => h.dateHour === data.dateHour);
            if (hourData) {
                hourData.totalIncome = data.totalIncome;
            }
        }
    });
    return timeSlots;
});
const createCheckout = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('stripe payment', payload);
    let session = {};
    // const lineItems = products.map((product) => ({
    //   price_data: {
    //     currency: 'usd',
    //     product_data: {
    //       name: 'Order Payment',
    //       description: 'Payment for user order',
    //     },
    //     unit_amount: Math.round(product.price * 100),
    //   },
    //   quantity: product.quantity,
    // }));
    const lineItems = [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Amount',
                },
                unit_amount: Math.round(payload.amount * 100),
            },
            quantity: 1,
        },
    ];
    console.log('lineItems=', lineItems);
    const sessionData = {
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://10.0.70.35:8078/api/v1/payment/success`,
        cancel_url: `http://10.0.70.35:8078/api/v1/payment/cancel`,
        line_items: lineItems,
        metadata: {
            userId: String(userId), // Convert userId to string
            orderId: String(payload.orderId),
            // cartIds: payload.cartIds,
            cartIds: JSON.stringify(payload.cartIds),
            // products: payload,
        },
    };
    console.log('sessionData=', sessionData);
    try {
        console.log('try session');
        session = yield exports.stripe.checkout.sessions.create(sessionData);
        console.log('session==', session);
        // console.log('session', session.id);
    }
    catch (error) {
        console.log('Error', error);
    }
    console.log('try session 22');
    // // console.log({ session });
    const { id: session_id, url } = session || {};
    console.log({ url });
    // console.log({ url });
    return { url };
});
const automaticCompletePayment = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hit hise webhook controller servie');
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                console.log('hit hise webhook controller servie checkout.session.completed');
                const sessionData = event.data.object;
                const { id: sessionId, payment_intent: paymentIntentId, metadata, } = sessionData;
                const orderId = metadata === null || metadata === void 0 ? void 0 : metadata.orderId;
                const userId = metadata === null || metadata === void 0 ? void 0 : metadata.userId;
                const cartIds = JSON.parse(metadata === null || metadata === void 0 ? void 0 : metadata.cartIds);
                console.log('cartIds==', cartIds);
                // session.metadata && (session.metadata.serviceBookingId as string);
                if (!paymentIntentId) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment Intent ID not found in session');
                }
                const paymentIntent = yield exports.stripe.paymentIntents.retrieve(paymentIntentId);
                if (!paymentIntent || paymentIntent.amount_received === 0) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment Not Successful');
                }
                const orderHistory = [
                    {
                        status: 'completed',
                        date: new Date(),
                    },
                    {
                        status: 'recived',
                        date: '',
                    },
                    {
                        status: 'ongoing',
                        date: '',
                    },
                    {
                        status: 'delivery',
                        date: '',
                    },
                    {
                        status: 'finished',
                        date: '',
                    },
                ];
                const order = yield orders_model_1.Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', status: 'completed', history: orderHistory }, { new: true, session });
                if (!order) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Order not found');
                }
                const productlist = yield Promise.all(order.productList.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                    const singleProduct = yield product_model_1.default.findById(product.productId).session(session);
                    if (!singleProduct) {
                        throw new AppError_1.default(404, 'Product is not Found!!');
                    }
                    if (singleProduct.availableStock < product.quantity) {
                        throw new AppError_1.default(403, 'Stock is not available!!');
                    }
                    const updatedProduct = yield product_model_1.default.findOneAndUpdate({
                        _id: product.productId,
                        availableStock: { $gte: product.quantity },
                    }, { $inc: { availableStock: -product.quantity } }, { new: true, session });
                    if (!updatedProduct) {
                        throw new AppError_1.default(403, 'Insufficient stock after retry');
                    }
                    // singleProduct.availableStock -= product.quantity;
                    // await singleProduct.save({ session });
                    return updatedProduct;
                })));
                console.log('===order', order);
                const paymentData = {
                    userId: userId,
                    amount: order === null || order === void 0 ? void 0 : order.totalAmount,
                    method: 'stripe',
                    transactionId: paymentIntentId,
                    orderId: order === null || order === void 0 ? void 0 : order._id,
                    status: 'paid',
                    session_id: sessionId,
                    transactionDate: order === null || order === void 0 ? void 0 : order.orderDate,
                };
                const payment = yield payment_model_1.Payment.create([paymentData], { session });
                console.log('===payment', payment);
                if (!payment) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment record creation failed');
                }
                const deletedCartProducts = yield Promise.all(cartIds.map((cartProductId) => __awaiter(void 0, void 0, void 0, function* () {
                    const isDelete = yield cart_model_1.default.findByIdAndDelete(cartProductId).session(session);
                    if (!isDelete) {
                        throw new AppError_1.default(404, 'Failed to delete cart product');
                    }
                })));
                const notificationData = {
                    userId: userId,
                    message: 'Order create successfull!!',
                    type: 'success',
                };
                const notificationData1 = {
                    role: 'admin',
                    message: 'New Order create successfull!!',
                    type: 'success',
                };
                const [notification, notification1] = yield Promise.all([
                    notification_service_1.notificationService.createNotification(notificationData),
                    notification_service_1.notificationService.createNotification(notificationData1),
                ]);
                if (!notification || !notification1) {
                    throw new AppError_1.default(404, 'Notification create faild!!');
                }
                const deletedServiceBookings = yield orders_model_1.Order.deleteMany({
                    userId,
                    status: 'pending',
                }, { session });
                console.log('deletedServiceBookings', deletedServiceBookings);
                yield session.commitTransaction();
                session.endSession();
                console.log('Payment completed successfully:', {
                    sessionId,
                    paymentIntentId,
                });
                break;
            }
            case 'checkout.session.async_payment_failed': {
                const session = event.data.object;
                const clientSecret = session.client_secret;
                const sessionId = session.id;
                if (!clientSecret) {
                    console.warn('Client Secret not found in session.');
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Client Secret not found');
                }
                // const payment = await Payment.findOne({ session_id: sessionId });
                // if (payment) {
                //   payment.status = 'Failed';
                //   await payment.save();
                //   // console.log('Payment marked as failed:', { clientSecret });
                // } else {
                //   console.warn(
                //     'No Payment record found for Client Secret:',
                //     clientSecret,
                //   );
                // }
                break;
            }
            default:
                // // console.log(`Unhandled event type: ${event.type}`);
                // res.status(400).send();
                return;
        }
    }
    catch (err) {
        console.error('Error processing webhook event:', err);
        yield session.abortTransaction();
        session.endSession();
    }
});
// const paymentRefundService = async (
//   amount: number | null,
//   payment_intent: string,
// ) => {
//   const refundOptions: Stripe.RefundCreateParams = {
//     payment_intent,
//   };
//   // Conditionally add the `amount` property if provided
//   if (amount) {
//     refundOptions.amount = Number(amount);
//   }
//   // console.log('refaund options', refundOptions);
//   const result = await stripe.refunds.create(refundOptions);
//   // console.log('refund result ', result);
//   return result;
// };
const getAllEarningRatio = (year, businessId) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalIncome: 0,
    }));
    // console.log({ months });
    const incomeData = yield payment_model_1.Payment.aggregate([
        {
            $match: {
                status: 'complete',
                transactionDate: { $gte: startOfYear, $lt: endOfYear },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$transactionDate' } },
                totalIncome: { $sum: '$amount' },
            },
        },
        {
            $project: {
                month: '$_id.month',
                totalIncome: 1,
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
    ]);
    incomeData.forEach((data) => {
        const monthData = months.find((m) => m.month === data.month);
        if (monthData) {
            monthData.totalIncome = data.totalIncome;
        }
    });
    return months;
});
// const refreshAccountConnect = async (
//   id: string,
//   host: string,
//   protocol: string,
// ): Promise<string> => {
//   const onboardingLink = await stripe.accountLinks.create({
//     account: id,
//     refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${id}`,
//     return_url: `${protocol}://${host}/api/v1/payment/success-account/${id}`,
//     type: 'account_onboarding',
//   });
//   return onboardingLink.url;
// };
// const createStripeAccount = async (
//   user: any,
//   host: string,
//   protocol: string,
// ): Promise<any> => {
//   // console.log('user',user);
//   const existingAccount = await StripeAccount.findOne({
//     userId: user.userId,
//   }).select('user accountId isCompleted');
//   // console.log('existingAccount', existingAccount);
//   if (existingAccount) {
//     if (existingAccount.isCompleted) {
//       return {
//         success: false,
//         message: 'Account already exists',
//         data: existingAccount,
//       };
//     }
//     const onboardingLink = await stripe.accountLinks.create({
//       account: existingAccount.accountId,
//       refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${existingAccount.accountId}`,
//       return_url: `${protocol}://${host}/api/v1/payment/success-account/${existingAccount.accountId}`,
//       type: 'account_onboarding',
//     });
//     // console.log('onboardingLink-1', onboardingLink);
//     return {
//       success: true,
//       message: 'Please complete your account',
//       url: onboardingLink.url,
//     };
//   }
//   const account = await stripe.accounts.create({
//     type: 'express',
//     email: user.email,
//     country: 'US',
//     capabilities: {
//       card_payments: { requested: true },
//       transfers: { requested: true },
//     },
//   });
//   // console.log('stripe account', account);
//   await StripeAccount.create({ accountId: account.id, userId: user.userId });
//   const onboardingLink = await stripe.accountLinks.create({
//     account: account.id,
//     refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${account.id}`,
//     return_url: `${protocol}://${host}/api/v1/payment/success-account/${account.id}`,
//     type: 'account_onboarding',
//   });
//   // console.log('onboardingLink-2', onboardingLink);
//   return {
//     success: true,
//     message: 'Please complete your account',
//     url: onboardingLink.url,
//   };
// };
// const transferBalanceService = async (
//   accountId: string,
//   amt: number,
//   userId: string,
// ) => {
//   const withdreawAmount = await availablewithdrawAmount('stripe', userId);
//   // console.log('withdreawAmount===', withdreawAmount[0].totalAmount);
//   if (withdreawAmount[0].totalAmount < 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Amount must be positive');
//   }
//   const amount = withdreawAmount[0].totalAmount * 100;
//   const transfer = await stripe.transfers.create({
//     amount,
//     currency: 'usd',
//     destination: accountId,
//   });
//   // console.log('transfer', transfer);
//   if (!transfer) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Transfer failed');
//   }
//   let withdraw;
//   if (transfer) {
//     const withdrawData: any = {
//       transactionId: transfer.id,
//       amount: withdreawAmount[0].totalAmount,
//       method: 'stripe',
//       status: 'completed',
//       businessId: userId,
//       destination: transfer.destination,
//     };
//     withdraw = withdrawService.addWithdrawService(withdrawData);
//     if (!withdraw) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Withdrawal failed');
//     }
//   }
//   return withdraw;
// };
// 0 0 */7 * *
// cron.schedule('* * * * *', async () => {
//   // console.log('Executing transferBalanceService every 7 days...');
//   const businessUser = await User.find({
//     role: 'business',
//     isDeleted: false,
//   });
//   // console.log('businessUser==', businessUser);
//   for (const user of businessUser) {
//     // console.log('usr=====');
//     const isExiststripeAccount:any = await StripeAccount.findOne({
//       userId: user._id,
//       isCompleted: true,
//     });
//     // console.log('isExiststripeAccount', isExiststripeAccount);
//     if (!isExiststripeAccount) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Account not found');
//     }
//      // console.log('=====1')
//     await transferBalanceService(
//       isExiststripeAccount.accountId,
//       0,
//       isExiststripeAccount.userId,
//     );
//     // console.log('=====2');
//   }
//   // await transferBalanceService();
// });
exports.paymentService = {
    addPaymentService,
    getAllPaymentService,
    singlePaymentService,
    deleteSinglePaymentService,
    getAllPaymentByCustomerService,
    getAllIncomeRatio,
    getAllIncomeRatiobyDays,
    createCheckout,
    automaticCompletePayment,
    getAllEarningRatio,
    //   paymentRefundService,
    //   filterBalanceByPaymentMethod,
    //   filterWithdrawBalanceByPaymentMethod,
    //   createStripeAccount,
    //   refreshAccountConnect,
    //   transferBalanceService,
};
