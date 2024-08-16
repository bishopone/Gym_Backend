const path = require('path');
const fs = require('fs');
const cardConfigService = require('../services/cardConfigService');

const saveCardConfig = async (req, res) => {
  try {
    const { files, body, user } = req;
    console.log(files);
    console.log(body);
    const gymId = user.gymId;

    const imageSavePath = path.join(__dirname, '../uploads/cards', gymId.toString());
    if (!fs.existsSync(imageSavePath)) {
      fs.mkdirSync(imageSavePath, { recursive: true });
    }

    const saveImage = (image, imageName) => {
      const imagePath = path.join(imageSavePath, imageName);
      image.mv(imagePath, (err) => {
        if (err) throw err;
      });
      return `/uploads/cards/${gymId}/${imageName}`;
    };

    let frontImageUrl = '';
    let backImageUrl = '';

    let cardConfigData = {
      ...body,
    };
    if (files?.frontImage) {
      frontImageUrl = saveImage(files.frontImage, `front_${Date.now()}_${files.frontImage.name}`);
      cardConfigData.frontImageUrl = frontImageUrl;
    }

    if (files?.backImage) {
      backImageUrl = saveImage(files.backImage, `back_${Date.now()}_${files.backImage.name}`);
      cardConfigData.backImageUrl = backImageUrl;
    }

    const cardConfig = await cardConfigService.saveCardConfig(cardConfigData, gymId);
    res.json({ success: true, cardConfig });
  } catch (error) {
    console.error('Error saving card configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to save card configuration.' });
  }
};

const fetchCardConfigs = async (req, res) => {
  try {
    const gymId = req.user.gymId;
    const cardConfigs = await cardConfigService.fetchCardConfigs(gymId);
    res.json({ success: true, cardConfigs });
  } catch (error) {
    console.error('Error fetching card configurations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch card configurations.' });
  }
};

const fetchActiveCardConfig = async (req, res) => {
  try {
    const gymId = req.user.gymId;
    const cardConfig = await cardConfigService.fetchActiveCardConfig(gymId);
    res.json({ success: true, cardConfig });
  } catch (error) {
    console.error('Error fetching card configurations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch card configurations.' });
  }
};

const updateCardConfig = async (req, res) => {
  const { id } = req.params;

  try {
    const { files, body, user } = req;
    console.log(body);
    const gymId = user.gymId;

    const imageSavePath = path.join(__dirname, '../uploads/cards', gymId.toString());
    if (!fs.existsSync(imageSavePath)) {
      fs.mkdirSync(imageSavePath, { recursive: true });
    }

    const saveImage = (image, imageName) => {
      const imagePath = path.join(imageSavePath, imageName);
      image.mv(imagePath, (err) => {
        if (err) throw err;
      });
      return `/uploads/cards/${gymId}/${imageName}`;
    };

    let frontImageUrl = '';
    let backImageUrl = '';

    let cardConfigData = {
      ...body,
    };
    if (files?.frontImage) {
      frontImageUrl = saveImage(files.frontImage, `front_${Date.now()}_${files.frontImage.name}`);
      cardConfigData.frontImageUrl = frontImageUrl;
    }

    if (files?.backImage) {
      backImageUrl = saveImage(files.backImage, `back_${Date.now()}_${files.backImage.name}`);
      cardConfigData.backImageUrl = backImageUrl;
    }

    const cardConfig = await cardConfigService.updateCardConfig(id, cardConfigData);
    res.json({ success: true, cardConfig });
  } catch (error) {
    console.error('Error updating card configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to update card configuration.' });
  }
};

const deleteCardConfig = async (req, res) => {
  const { id } = req.params;

  try {
    const cardConfig = await cardConfigService.deleteCardConfig(id);
    res.json({ success: true, cardConfig });
  } catch (error) {
    console.error('Error deleting card configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to delete card configuration.' });
  }
};


const makeCardActive = async (req, res) => {
  const { id } = req.params;
  try {
    const cardConfig = await cardConfigService.makeCardActive(id);
    res.json({ success: true, cardConfig });
  } catch (error) {
    console.error('Error deleting card configuration:', error);
    res.status(500).json({ success: false, error: 'Failed to delete card configuration.' });
  }
};

const uploadImage = (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send('No file uploaded.');
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, '../uploads/cards/', image.name);

    image.mv(uploadPath, (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ imageUrl: `/uploads/cards/${image.name}` });
    });
  } catch (error) {
    console.error('Error uploading card image:', error);
    res.status(500).json({ success: false, error: 'Failed to upload card image.' });
  }
};

module.exports = {
  saveCardConfig,
  fetchActiveCardConfig,
  deleteCardConfig,
  makeCardActive,
  fetchCardConfigs,
  updateCardConfig,
  uploadImage,
};
