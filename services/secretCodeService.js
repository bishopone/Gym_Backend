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


const generateUniqueIds = (count, gymId) => {
  const ids = new Set();
  const gymIdStr = gymId.toString(); // Convert gymId to string
  const gymIdLength = gymIdStr.length;
  const randomIdLength = 20 - gymIdLength; // Calculate the length needed for the random part

  if (randomIdLength <= 0) {
    throw new Error("gymId is too long to generate a 20-character unique ID");
  }

  while (ids.size < count) {
    const randomId = crypto.randomBytes(Math.ceil(randomIdLength / 2)).toString('hex').slice(0, randomIdLength); // Ensure the random ID is exactly the required length
    const uniqueId = gymIdStr + randomId;
    console.log(uniqueId)
    ids.add(uniqueId);
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