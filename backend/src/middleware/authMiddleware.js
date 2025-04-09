import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("Authorization header is missing"); // Log missing header
    return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error("Token is missing in Authorization header"); // Log missing token
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
