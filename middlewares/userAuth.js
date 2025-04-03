import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const secretToken = process.env.SECRET_TOKEN;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretToken, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};