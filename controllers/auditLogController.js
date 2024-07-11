const auditLogService = require('../services/auditLogService');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await auditLogService.getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
