import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { howMadeService } from './howMade.service';

const createHowMade = catchAsync(async (req, res) => {

    const payload = req.body;
     const madeFiles = req.files as {
       [fieldname: string]: Express.Multer.File[];
     };

     console.log('madeFiles', madeFiles);
     if (madeFiles?.image1 && madeFiles.image1.length > 0) {
       payload.image1 = madeFiles.image1[0].path.replace(/^public[\\/]/, '');
     }
     if (madeFiles?.image2 && madeFiles.image2.length > 0) {
        payload.image2 = madeFiles.image2[0].path.replace(/^public[\\/]/, '');
     }
     if (madeFiles?.video && madeFiles.video.length > 0) {
        payload.video = madeFiles.video[0].path.replace(/^public[\\/]/, '');
     }



  const result = await howMadeService.createHowMade(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Made Info Create successful!!',
  });
});


const getAllHowMade = catchAsync(async (req, res) => {
  const { meta, result } = await howMadeService.getAllHowMadeQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All HowMade are requered successful!!',
  });
});



const getSingleHowMade = catchAsync(async (req, res) => {
  const result = await howMadeService.getSingleHowMadeQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single HowMade are requered successful!!',
  });
});

const updateSingleHowMade = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const madeFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  console.log('madeFiles', madeFiles);
  if (madeFiles?.image1 && madeFiles.image1.length > 0) {
    payload.image1 = madeFiles.image1[0].path.replace(/^public[\\/]/, '');
  }
  if (madeFiles?.image2 && madeFiles.image2.length > 0) {
    payload.image2 = madeFiles.image2[0].path.replace(/^public[\\/]/, '');
  }
  if (madeFiles?.video && madeFiles.video.length > 0) {
    payload.video = madeFiles.video[0].path.replace(/^public[\\/]/, '');
  }


  const result = await howMadeService.updateSingleHowMadeStatusQuery(
    id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single HowMade status are updated successful!!',
  });
});

const deleteSingleHowMade = catchAsync(async (req, res) => {
  const result = await howMadeService.deletedHowMadeQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single HowMade are successful!!',
  });
});

export const howMadeController = {
  createHowMade,
  getAllHowMade,
  getSingleHowMade,
  updateSingleHowMade,
  deleteSingleHowMade,
};
