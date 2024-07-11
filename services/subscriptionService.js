const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSubscriptionService = async (subscriptionData) => {
  const { userId, subscriptionTypeId, startDate } = subscriptionData;
  
  const subscriptionType = await prisma.subscriptionType.findUnique({
    where: { id: parseInt(subscriptionTypeId) },
  });

  if (!subscriptionType) {
    throw new Error('Subscription type not found');
  }

  const calculatedStartDate = startDate || new Date();
  const calculatedEndDate = new Date(calculatedStartDate);
  calculatedEndDate.setDate(calculatedEndDate.getDate() + subscriptionType.durationInDays);

  const existingSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: parseInt(userId),
      endDate: {
        gte: new Date(), // Check if the end date is in the future
      },
    },
  });

  if (existingSubscription) {
    // Update existing subscription
    return await prisma.userSubscription.update({
      where: { id: parseInt(existingSubscription.id) },
      data: {
        startDate: calculatedStartDate,
        endDate: calculatedEndDate,
      },
    });
  } else {
    // Insert new subscription
    return await prisma.userSubscription.create({
      data: {
        userId: parseInt(userId),
        subscriptionTypeId: parseInt(subscriptionTypeId),
        startDate: calculatedStartDate,
        endDate: calculatedEndDate,
      },
    });
  }
};;

exports.getUserSubscriptionDaysLeft = async (userId) => {
  const subscription = await prisma.userSubscription.findFirst({
    where: { userId },
    orderBy: { endDate: 'desc' },
  }); 

  if (!subscription) {
    return null;
  }

  const today = new Date();
  const timeDiff = subscription.endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return { subscription, daysLeft };
};


exports.getUserSubscription = async (userId) => {
  const subscription = await prisma.userSubscription.findFirst({
    where: { userId: parseInt(userId) },
    select:{ startDate:true,endDate:true, subscriptionType: true},
    
    orderBy: { endDate: 'desc' },
  }); 

  if (!subscription) {
    return null;
  }

  const today = new Date();
  const timeDiff = subscription.endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return { subscription, daysLeft };
};
