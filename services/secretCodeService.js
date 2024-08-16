const prisma = require('../prisma/client'); // Assuming prismaClient is your Prisma setup file
const crypto = require('crypto'); // Assuming prismaClient is your Prisma setup file
const userService = require("./userService");

const assignCardToUser = async (cardId, userId) => {
  // First, check if the card is already assigned to another user
  const existingCard = await prisma.secretCode.findUnique({
    where: { id: cardId },
  });

  if (existingCard) {
    if (existingCard.userid && existingCard.userid !== userId) {
      throw new Error('This card is already assigned to another user.');
    }
  }

  // Upsert operation: Update if exists, create otherwise
  const updatedCard = await prisma.secretCode.upsert({
    where: { id: cardId },
    update: { userid: userId },
    create: {
      id: cardId,
      userid: userId,
      // Include other necessary fields for the creation if needed
    },
  });

  return updatedCard;
};

const reassignCardToUser = async (cardId, userId) => {
  // Detach the card from any other user if attached
  await prisma.secretCode.updateMany({
    where: { userid: userId },
    data: { userid: null },
  });

  // Assign the card to the user
  const updatedCard = await prisma.secretCode.update({
    where: { id: cardId },
    data: { userid: userId },
  });

  return updatedCard;
};

const getUserByCardId = async (cardId) => {
  console.log(cardId)
  const card = await prisma.secretCode.findUnique({
    where: { id: cardId },
  });


  if (!card) {
    return null;
  }
  const user = await userService.getUserById(card.userid);

  return user;
};

const removeCardFromUser = async (userId, gymId) => {
  const user = await prisma.user.findUnique({where:{
    id: userId
  }})
  if(user.gymId !== gymId){
    throw Error("You Cant Remove This Card You Dont Own It.")
  }
  const updatedCard = await prisma.secretCode.updateMany({
    where: { userid: userId },
    data: { userid: null },
  });

  return updatedCard;
};


const generateUniqueIds = (count) => {
    const ids = new Set();
  
    while (ids.size < count) {
      const id = crypto.randomBytes(10).toString('hex'); // Generates a 20-character hex string
      ids.add(id);
    }
  
    return Array.from(ids);
  };
  
  module.exports = {
    assignCardToUser,
    reassignCardToUser,
    getUserByCardId,
    removeCardFromUser,
    generateUniqueIds,
  };