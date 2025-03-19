import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1hr",
  });
};
