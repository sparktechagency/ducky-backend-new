import { Error, Schema, Types, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import { gender, Role, USER_ROLE } from './user.constants';

const userSchema = new Schema<TUser>(
  {
    image: {
      type: String,
      default: '/uploads/profile/default-user.jpg',
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    role: {
      type: String,
      enum: Role,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: false,
      default: '',
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: false,
      default: '',
    },
    
    
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Remove password field
  return user;
};

// filter out deleted documents
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  // console.log({ email });
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.isUserActive = async function (email: string) {
  return await User.findOne({
    email: email,
    isDeleted: false,
    isActive: true,
  }).select('+password');
};

userSchema.statics.IsUserExistById = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
