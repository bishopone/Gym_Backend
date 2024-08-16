const prisma = require("../prisma/client");

const saveCardConfig = async (data, gymId) => {
  const {
    frontBarcode,
    frontQRCode,
    backBarcode,
    backQRCode,
    frontImageUrl,
    backImageUrl,
    active,
    frontImageSize,
backImageSize,
  } = data;

  return await prisma.CardConfigurations.create({
    data: {
      gymId,
      frontBarcode: JSON.stringify(frontBarcode),
      frontQRCode: JSON.stringify(frontQRCode),
      backBarcode: JSON.stringify(backBarcode),
      backQRCode: JSON.stringify(backQRCode),
      frontImageSize: JSON.stringify(frontImageSize),
      backImageSize: JSON.stringify(backImageSize),
      frontImage: frontImageUrl,
      backImage: backImageUrl,
      active: false
    },
  });
};

const fetchCardConfigs = async (gymId) => {
  const cardConfigs = await prisma.CardConfigurations.findMany({
    where: { gymId: parseInt(gymId) },
  });

  // Parse the JSON strings back to objects
  cardConfigs.forEach((config) => {
    config.frontBarcode = JSON.parse(config.frontBarcode);
    config.frontQRCode = JSON.parse(config.frontQRCode);
    config.backBarcode = JSON.parse(config.backBarcode);
    config.backQRCode = JSON.parse(config.backQRCode);
    config.backImageSize = JSON.parse(config.backImageSize);
    config.frontImageSize = JSON.parse(config.frontImageSize);
  });

  return cardConfigs;
};

const fetchActiveCardConfig = async (gymId) => {
  const cardConfigs = await prisma.CardConfigurations.findMany({
    where: {
      AND: [
        {gymId: parseInt(gymId) },
        {active: true},
      ] },
  });

  // Parse the JSON strings back to objects
  cardConfigs.forEach((config) => {
    config.frontBarcode = JSON.parse(config.frontBarcode);
    config.frontQRCode = JSON.parse(config.frontQRCode);
    config.backBarcode = JSON.parse(config.backBarcode);
    config.backQRCode = JSON.parse(config.backQRCode);
    config.backImageSize = JSON.parse(config.backImageSize);
    config.frontImageSize = JSON.parse(config.frontImageSize);

  });

  return cardConfigs;
};
const updateCardConfig = async (id, data) => {
  const {
    frontBarcode,
    frontQRCode,
    backBarcode,
    backQRCode,
    frontImageUrl,
    backImageUrl,
    active,
  } = data;

  return await prisma.CardConfigurations.update({
    where: { id: parseInt(id) },
    data: {
      frontBarcode: JSON.stringify(frontBarcode),
      frontQRCode: JSON.stringify(frontQRCode),
      backBarcode: JSON.stringify(backBarcode),
      backQRCode: JSON.stringify(backQRCode),
      frontImage: frontImageUrl,
      backImage: backImageUrl,
    },
  });
};


const makeCardActive = async (id) => {
  // Convert id to integer if it is not already
  const cardId = parseInt(id);

  // Find the card configuration being activated
  const cardToActivate = await prisma.CardConfigurations.findUnique({
    where: { id: cardId },
    select: { gymId: true }
  });

  if (!cardToActivate) {
    throw new Error('Card configuration not found');
  }

  const { gymId } = cardToActivate;

  // Deactivate other active card configurations with the same gymId
  await prisma.CardConfigurations.updateMany({
    where: {
      gymId: gymId,
      active: true,
      id: {
        not: cardId  // Exclude the card being activated
      }
    },
    data: { active: false }
  });

  // Activate the desired card configuration
  return await prisma.CardConfigurations.update({
    where: { id: cardId },
    data: { active: true }
  });
};

const deleteCardConfig = async (id) => {
  return await prisma.CardConfigurations.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  saveCardConfig,
  makeCardActive,
fetchActiveCardConfig,
  fetchCardConfigs,
  deleteCardConfig,
  updateCardConfig,
};
