const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized - Missing Token' });
  }

  const [bearer, token] = authHeader.split(' ').map(value => value.trim());

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token Format' });
  }

  try {
    const decoded = jwt.verify(token, 'access');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }
};

module.exports = { verifyToken };
