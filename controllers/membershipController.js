const membershipService = require('../services/membershipService');

exports.createMembership = async (req, res) => {
    const { userId, gymId, startDate, endDate } = req.body;
    try {
        const result = await membershipService.createMembership(userId, gymId, startDate, endDate);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMembership = async (req, res) => {
    const { id, userId, gymId, startDate, endDate, isActive } = req.body;
    try {
        const result = await membershipService.updateMembership(id, userId, gymId, startDate, endDate, isActive);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMembership = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await membershipService.deleteMembership(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
