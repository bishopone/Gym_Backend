const secretCodeService = require("../services/secretCodeService");
const attendanceService = require("../services/attendanceService");

const assignCardToUser = async (req, res) => {
  const { cardId, userId } = req.body;

  try {
    console.log(cardId, userId);
    const result = await secretCodeService.assignCardToUser(
      cardId,
      parseInt(userId)
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const reassignCardToUser = async (req, res) => {
  const { cardId, userId } = req.body;

  try {
    const result = await secretCodeService.reassignCardToUser(cardId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserByCardId = async (req, res) => {
  const { cardId } = req.params;

  try {
    const user = await secretCodeService.getUserByCardId(cardId);
    if (user) {
      try {
        await attendanceService.createAttendance(user.id, user.gymId);
      } catch (err) {
        user.message = "User has already attended today";
      }
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const removeCardFromUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await secretCodeService.removeCardFromUser(userId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateUniqueIds = async (req, res) => {
  console.log("selam");
  const { count } = req.params;
  const countNumber = parseInt(count, 10);

  if (isNaN(countNumber) || countNumber <= 0) {
    return res.status(400).json({ message: "Invalid count value" });
  }

  try {
    const ids = secretCodeService.generateUniqueIds(countNumber);
    res.status(200).json(ids);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating unique IDs" });
  }
};

module.exports = {
  assignCardToUser,
  reassignCardToUser,
  getUserByCardId,
  removeCardFromUser,
  generateUniqueIds,
};
