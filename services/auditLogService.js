const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.logChange = async (tableName, recordId, action, oldValue, newValue) => {
    return await prisma.auditLog.create({
        data: {
            tableName,
            recordId,
            action,
            oldValue,
            newValue
        }
    });
};

exports.getAllLogs = async () => {
    return await prisma.auditLog.findMany();
};
