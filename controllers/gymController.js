const gymService = require('../services/gymService');

const createGym = async (req, res) => {
  try {
    const gym = await gymService.createGym(req.body, req.files?.logo);
    res.status(201).json(gym);
  } catch (error) {
    console.error('Error creating gym:', error);
    res.status(400).json({ message: error.message });
  } 
};

const editGym = async (req, res) => {
  try {
    const gym = await gymService.editGym(req.body, req.files?.logo, req.params.id);
    res.status(201).json(gym);
  } catch (error) {
    console.error('Error creating gym:', error);
    res.status(400).json({ message: error.message });
  } 
};

const getGyms = async (req, res) => {
  try {
    const gyms = await gymService.getGyms(req);
    res.status(200).json(gyms);
  } catch (error) {
    console.error('Error getting gyms:', error);
    res.status(400).json({ message: error.message });
  }
};

const getGymById = async (req, res) => {
  try {
    const gym = await gymService.getGymById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.status(200).json(gym);
  } catch (error) {
    console.error('Error getting gym:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteGymById = async (req, res) => {
  try {
    const gym = await gymService.deleteGymById(req.params.id);
    res.status(200).json(gym);
  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateGymStatusById = async (req, res) => {
  try {
    const status = req.body?.status;
    const gym = await gymService.updateGymStatusById(req.params.id, status);
    res.status(200).json(gym);
  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(400).json({ message: error.message });
  }
};
module.exports = { createGym, getGyms, getGymById, deleteGymById, updateGymStatusById, editGym };
