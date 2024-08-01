// prisma/client.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


prisma.$use(async (params, next) => {
    if (params.model === 'User' ) {
      if (!params.args.where) {
        params.args.where = {};
      }
      params.args.where.status = 'Active';  
    }
    return next(params);
  });
  
module.exports = prisma;
