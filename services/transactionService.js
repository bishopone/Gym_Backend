const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auditLogService = require('./auditLogService');

exports.startTransaction = async (transactionData) => {
  const {
    userId,
    amount,
    transactionType,
    transactionDate,
    description,
    paymentMethod,
    subscriptionId,
    gymId,
    status
  } = transactionData;

  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        transactionDate,
        transactionType: transactionType,
        description,
        status:status,
        payments: {
          create: {
            amount,
            paymentMethod
          }
        },
        subscription:
        {
          connect:
          {
            id: subscriptionId
          }
        },
        gym: {
          connect: {
            id: gymId
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
      },
      include: {
        payments: true
      }
    });

    await auditLogService.logChange('Transaction', transaction.id, 'create', null, JSON.stringify(transaction));

    return transaction;
  });
};

exports.completeTransaction = async (transactionId) => {
  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'Paid' }
    });

    await auditLogService.logChange('Transaction', transaction.id, 'update', null, JSON.stringify(transaction));

    return transaction;
  });
};

exports.allTransactions = async ({ page, pageSize, startDate, endDate, userId, status }) => {
  try {
    const whereClause = {};

    if (startDate) {
      whereClause.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      whereClause.createdAt = { ...whereClause.createdAt, lte: new Date(endDate) };
    }
    if (userId) {
      whereClause.userId = parseInt(userId);
    }
    if (status) {
      whereClause.status = status;
    }

    const total = await prisma.transaction.count({ where: whereClause });
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user:true,
        subscription: {
          select:{
            subscriptionType: true
          }
        }
    
      },
      orderBy: { transactionDate: 'desc' },
    });

    return {
      total,
      page,
      pageSize,
      transactions,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
