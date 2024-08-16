const connect = require('connect-sqlite3');
const prisma = require('../prisma/client')
const transactionService = require('./transactionService')
exports.createSubscriptionService = async (subscriptionData, user) => {
  const { userId, subscriptionTypeId,status, startDate } = subscriptionData;
  var gymId = subscriptionData.gymId
  if(user){
    gymId = user.gymId
  }

  const subscriptionType = await prisma.subscriptionType.findUnique({
    where: { id: parseInt(subscriptionTypeId) },
  });

  if (!subscriptionType) {
    throw new Error('Subscription type not found');
  }

  const calculatedStartDate = startDate || new Date();
  const calculatedEndDate = new Date(calculatedStartDate);
  const now = new Date()
  calculatedEndDate.setDate(calculatedEndDate.getDate() + subscriptionType.durationInDays);


    const userSubscription =  await prisma.userSubscription.create({
      data: {
        userId: parseInt(userId),
        subscriptionTypeId: parseInt(subscriptionTypeId),
        startDate: calculatedStartDate,
        endDate: calculatedEndDate,
      },
    });

    console.log(user)
    const transactionData = {
      userId: parseInt(userId),
    amount: subscriptionType.cost,
    transactionType: 'Subscription',
    transactionDate: now,
    description: '',
    subscriptionId: userSubscription.id,
    paymentMethod: 'Cash',
    status: status,
    gymId: parseInt(gymId),
    }
    const result = await transactionService.startTransaction(transactionData);
    console.log(result)
    return userSubscription;

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
  const subscriptions = await prisma.userSubscription.findMany({
    where: { userId: parseInt(userId) },
    select:{ id: true, startDate:true,endDate:true, subscriptionType: true},
    orderBy: { endDate: 'desc' },
  }); 

  if (!subscriptions) {
    return null;
  }

  const formatedData = subscriptions.map((subscription)=>
  {
    const today = new Date();
    const timeDiff = subscription.endDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return { subscription, daysLeft }
  })

  return formatedData;
};


exports.deleteUserSubscription = async (id) => {
   await prisma.userSubscription.delete({
    where: { id: parseInt(id) },
  }); 

};

