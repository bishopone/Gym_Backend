const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
require('dotenv').config();

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === "null" || token === null) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  try {
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user; // Attach user object to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


const checkPermission = (permissionName) => {
  return async (req, res, next) => {
      const userId = req.user.id; // Assuming you have user information in the request

      const userRoles = await prisma.userRole.findMany({
          where: { userId },
          include: { role: { include: { permissions: { include: { permission: true } } } } }
      });

      const hasPermission = userRoles.some(userRole =>
          userRole.role.permissions.some(rolePermission =>
              rolePermission.permission.permissionName === permissionName
          )
      );

      if (!hasPermission) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
  };
};
module.exports = {validateToken, checkPermission};
