import mongoose, { Schema } from 'mongoose';
import AppError from '../../error/AppError';
import { THowMade } from './howMade.interface';

const howMadeSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['text', 'image', 'video'],
      required: true,
    },
    title: { type: String, required: true },
    details: { type: String, required: true },
    firstName: { type: String, required: false },
    secondName: { type: String, required: false },
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    video: { type: String, required: false },
  },
  { timestamps: true },
);

howMadeSchema.pre('save', function (next) {
  if (this.category === 'text') {
    if (!this.title || !this.details) {
      throw new AppError(
        403,
        'Title and Details are required for category "text"!',
      );
    }
    if (this.firstName || this.secondName || this.image1 || this.image2 || this.video) {
      throw new AppError(
        403,
        'firstName, secondName, image1, image2 are not required for category "text"!',
      );
    }
  } else if (this.category === 'image') {
    if (
      !this.title ||
      !this.details ||
      !this.firstName ||
      !this.secondName ||
      !this.image1 ||
      !this.image2
    ) {
      throw new AppError(
        403,
        'Title, firstName, secondName, image1, image2 and details are required for category "image"!',
      );
    }
     if (
       this.video
     ) {
       throw new AppError(
         403,
         'firstName, secondName, image1, image2 are not required for category "text"!',
       );
     }
  } else if (this.category === 'video') {
    if (!this.title || !this.details || !this.video) {
      throw new AppError(
        403,
        'Title, details, and video are required for category "video"!',
      );
    }
     if (
       this.firstName ||
       this.secondName ||
       this.image1 ||
       this.image2 
     ) {
       throw new AppError(
         403,
         'firstName, secondName, image1, image2 are not required for category "text"!',
       );
     }
  }
  next(); 
});


const HowMade = mongoose.model<THowMade>('HowMade', howMadeSchema);

export default HowMade;
