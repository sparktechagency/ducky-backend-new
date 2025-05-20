import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const userValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    // phone: z
    //   .string()
    //   .min(10, { message: 'Phone number must be at least 10 digits' }),
    image: z.string().optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
};
