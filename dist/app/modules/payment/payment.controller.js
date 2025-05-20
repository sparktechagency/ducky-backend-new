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
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payment_service_1 = require("./payment.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
// import { StripeAccount } from '../stripeAccount/stripeAccount.model';
const addPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const orderData = req.body;
    orderData.userId = userId;
    const result = yield payment_service_1.paymentService.addPaymentService(orderData);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment Successfull!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getAllPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.getAllPaymentService(req.query);
    // // console.log('result',result)
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment are retrived Successfull!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getAllPaymentByCustormer = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log('customer id', userId);
    const result = yield payment_service_1.paymentService.getAllPaymentByCustomerService(req.query, userId);
    // // console.log('result',result)
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'My Payment are retrived Successfull!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getSinglePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.singlePaymentService(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Single Payment are retrived Successfull!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const deleteSinglePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // give me validation data
    const result = yield payment_service_1.paymentService.deleteSinglePaymentService(req.params.id);
    if (result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Single Delete Payment Successfull!!!',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: true,
            message: 'Data is not found',
            data: {},
        });
    }
}));
const getAllIncomeRasio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const yearQuery = req.query.year;
    // Safely extract year as string
    const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;
    if (!year || isNaN(year)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: 'Invalid year provided!',
            data: {},
        });
    }
    const result = yield payment_service_1.paymentService.getAllIncomeRatio(year);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Income All Ratio successful!!',
    });
}));
const getAllIncomeRasioBydays = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { days } = req.query;
    const result = yield payment_service_1.paymentService.getAllIncomeRatiobyDays(days);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Income All Ratio successful!!',
    });
}));
//payment
const successPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('hit hoise');
    res.render('success.ejs');
}));
const cancelPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('cancel.ejs');
}));
// const successPageAccount = catchAsync(async (req, res) => {
//   // console.log('payment account hit hoise');
//   const { id } = req.params;
//   const account = await stripe.accounts.update(id, {});
//   // console.log('account', account);
//   if (
//     account?.requirements?.disabled_reason &&
//     account?.requirements?.disabled_reason.indexOf('rejected') > -1
//   ) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (
//     account?.requirements?.disabled_reason &&
//     account?.requirements?.currently_due &&
//     account?.requirements?.currently_due?.length > 0
//   ) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (!account.payouts_enabled) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   if (!account.charges_enabled) {
//     return res.redirect(
//       `${req.protocol + '://' + req.get('host')}/api/v1/payment/refreshAccountConnect/${id}`,
//     );
//   }
//   // if (account?.requirements?.past_due) {
//   //     return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
//   // }
//   if (
//     account?.requirements?.pending_verification &&
//     account?.requirements?.pending_verification?.length > 0
//   ) {
//     // return res.redirect(`${req.protocol + '://' + req.get('host')}/payment/refreshAccountConnect/${id}`);
//   }
//   await StripeAccount.updateOne({ accountId: id }, { isCompleted: true });
//   res.render('success-account.ejs');
// });
//webhook
const createCheckout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield payment_service_1.paymentService.createCheckout(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment initialized',
        data: result,
    });
}));
const conformWebhook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('wabook hit hoise controller')
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Verify the event using Stripe's library
        event = payment_service_1.stripe.webhooks.constructEvent(req.body, sig, config_1.default.WEBHOOK);
        yield payment_service_1.paymentService.automaticCompletePayment(event);
    }
    catch (err) {
        console.error('Error verifying webhook signature:', err);
        // res.status(400).send('Webhook Error');
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Webhook Error');
        // return;
    }
}));
const getAllEarningRasio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const yearQuery = req.query.year;
    const { userId } = req.user;
    // Safely extract year as string
    const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;
    if (!year || isNaN(year)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: 'Invalid year provided!',
            data: {},
        });
    }
    const result = yield payment_service_1.paymentService.getAllEarningRatio(year, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Earning All Ratio successful!!',
    });
}));
// const paymentRefund = catchAsync(async (req, res) => {
//   const { amount, payment_intent } = req.body;
//   // console.log('refaund data', req.body);
//   const result = await paymentService.paymentRefundService(
//     amount,
//     payment_intent,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Payment Refund Successfull',
//     data: result,
//   });
// });
// const getAllEarningByPaymentMethod = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const result = await paymentService.filterBalanceByPaymentMethod(userId);
//   // console.log('result', result);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result ? result : 0,
//     message: 'Earning All balance  successful!!',
//   });
// });
// const refreshAccountConnect = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const url = await paymentService.refreshAccountConnect(
//     id,
//     req.get('host') || '',
//     req.protocol,
//   );
//   res.redirect(url);
// });
// const createStripeAccount = catchAsync(async (req, res) => {
//   const result = await paymentService.createStripeAccount(
//     req.user,
//     req.get('host') || '',
//     req.protocol,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Stripe account created',
//     data: result,
//   });
// });
// const transferBalance = catchAsync(async (req, res) => {
//   const { accountId, amount } = req.body;
//   const { userId } = req.user;
//   const result = await paymentService.transferBalanceService(
//     accountId,
//     amount,
//     userId,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Transfer balance success',
//     data: result,
//   });
// });
exports.paymentController = {
    addPayment,
    getAllPayment,
    getSinglePayment,
    deleteSinglePayment,
    getAllPaymentByCustormer,
    getAllIncomeRasio,
    getAllIncomeRasioBydays,
    createCheckout,
    conformWebhook,
    successPage,
    cancelPage,
    getAllEarningRasio,
    //   successPageAccount,
    //   paymentRefund,
    //   getAllEarningByPaymentMethod,
    //   getAllWithdrawEarningByPaymentMethod,
    //   createStripeAccount,
    //   refreshAccountConnect,
    //   transferBalance,
};
