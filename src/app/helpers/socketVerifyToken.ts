import jwt from 'jsonwebtoken';

export const socketVerifyToken = (token: string, secret: string) => {
  return new Promise<any>((resolve, reject) => {
    // Check if secret is undefined or empty
    if (!secret) {
      reject(new Error('JWT secret is not defined.'));
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err); // Reject with error if JWT is invalid
      } else {
        resolve(decoded); // Resolve with decoded token if valid
      }
    });
  });
};
