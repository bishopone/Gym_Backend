// services/cardConfigService.js

const prisma = require("../prisma/client");

const saveCardConfig = async (data, gymId) => {
  const {
    namePosition,
    qrCodePosition,
    frontImageUrl,
    backImageUrl,
    nameRotation,
    nameScale,
    nameColor,
    barcodeRotation,
    barcodeScale,
    active,
  } = data;

  return await prisma.cardConfiguration.create({
    data: {
      gymId,
      namePosition: JSON.stringify(namePosition),
      qrCodePosition: JSON.stringify(qrCodePosition),
      frontImage: frontImageUrl,
      backImage: backImageUrl,
      nameRotation: parseFloat(nameRotation),
      nameScale: parseFloat(nameScale),
      nameColor,
      barcodeRotation: parseFloat(barcodeRotation),
      barcodeScale: parseFloat(barcodeScale),
      active: active === "true" ? true : false,
    },
  });
};

const fetchCardConfigs = async (gymId) => {
  const cardConfigs = await prisma.cardConfiguration.findMany({
    where: { gymId: parseInt(gymId) },
  });

  // Parse namePosition and qrCodePosition from string to JSON
  cardConfigs.forEach((config) => {
    config.namePosition = JSON.parse(config.namePosition);
    config.qrCodePosition = JSON.parse(config.qrCodePosition);
  });

  return cardConfigs;
};

const updateCardConfig = async (id, data) => {
  const {
    namePosition,
    qrCodePosition,
    frontImageUrl,
    backImageUrl,
    nameRotation,
    nameScale,
    nameColor,
    barcodeRotation,
    barcodeScale,
    active,
  } = data;

  return await prisma.cardConfiguration.update({
    where: { id: parseInt(id) },
    data: {
      namePosition: JSON.stringify(namePosition),
      qrCodePosition: JSON.stringify(qrCodePosition),
      frontImage: frontImageUrl,
      backImage: backImageUrl,
      nameRotation: parseFloat(nameRotation),
      nameScale: parseFloat(nameScale),
      nameColor,
      barcodeRotation: parseFloat(barcodeRotation),
      barcodeScale: parseFloat(barcodeScale),
      active: active === "true" ? true : false,
    },
  });
};

const deleteCardConfig = async (id) => {
  return await prisma.cardConfiguration.delete({
    where: { id: parseInt(id) },
  });
};
module.exports = {
  saveCardConfig,
  fetchCardConfigs,
  deleteCardConfig,
  updateCardConfig,
};
