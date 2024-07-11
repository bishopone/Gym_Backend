const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUserSubscription = async (userSubscriptionData) => {
  return await prisma.userSubscription.create({
    data: userSubscriptionData,
  });
};

exports.getUserSubscriptions = async (userId) => {
  return await prisma.userSubscription.findMany({
    where: {
      userId: parseInt(userId),
    },
    include: {
      subscriptionType: true,
    },
  });
};


exports.getAllUserSubscriptions = async () => {
    return await prisma.userSubscription.findMany({
      include: {
        subscriptionType: true,
        user:true,
        
      },
    });
  };
  