const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auditLogService = require('./auditLogService');
const { createSubscriptionService } = require('./subscriptionService');

exports.startTransaction = async (transactionData) => {
  const {
    userId,
    amount,
    transactionType,
    transactionDate,
    description,
    paymentMethod,
    gymId,
    subscriptionData // Added subscriptionData here
  } = transactionData;

  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        transactionDate,
        transactionType: transactionType,
        description,
        payments: {
          create: {
            amount,
            paymentMethod
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

    // If there is subscription data, create a subscription
    if (subscriptionData) {
      await createSubscriptionService({
        ...subscriptionData,
        createdById: userId,
        gymId,
      });
    }

    await auditLogService.logChange('Transaction', transaction.id, 'create', null, transaction);

    return transaction;
  });
};

exports.completeTransaction = async (transactionId) => {
  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { transactionType: 'complete' }
    });

    await auditLogService.logChange('Transaction', transaction.id, 'update', { transactionType: 'purchase' }, transaction);

    return transaction;
  });
};
