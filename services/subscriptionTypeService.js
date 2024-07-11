const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSubscriptionType = async (subscriptionTypeData, user) => {
  return await prisma.subscriptionType.create({
    data: {...subscriptionTypeData, gymId: parseInt(user.gymId)},
  });
};

exports.getAllSubscriptionTypes = async (req) => {
  let where = {}
  if(req.user.gymId){
     where = {gymId: req.user.gymId}
  }
  const subs =  await prisma.subscriptionType.findMany({where: where });

  const subIds = subs.map((sub) => sub.id);
  const constraints = await prisma.subscriptionType.findMany({
    where: { id: { in: subIds } },
    select: {
      id: true,
      status: true,
      _count: {
        select: {
          userSubscriptions: true,
        },
      },
    },
  });

  const subsWithConstraints = subs.map((sub) => {
    const gymConstraint = constraints.find(
      (constraint) => constraint.id === sub.id
    );
    const canDelete = Object.values(gymConstraint._count).every(
      (count) => count === 0
    );
    const canDisable = gymConstraint.status !== "Disabled";
    return { ...sub, canDelete, canDisable };
  });

  return subsWithConstraints;
};

exports.getSubscriptionTypesById = async (id) => {
  return await prisma.subscriptionType.findUnique({where:{id:parseInt(id)}})
};


exports.updateSubscriptionTypesById = async (id, data) => {
  return await prisma.subscriptionType.update({where:{id:parseInt(id)},data:data})
};

exports.deleteSubscriptionTypesById = async (id) => {
  return await prisma.subscriptionType.delete({where:{id:parseInt(id)}})
};
