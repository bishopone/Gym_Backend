const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auditLogService = require('./auditLogService');

exports.createMembership = async (userId, gymId, startDate, endDate) => {
    return await prisma.$transaction(async (prisma) => {
        const membership = await prisma.membership.create({
            data: {
                userId,
                gymId,
                startDate,
                endDate
            }
        });

        await auditLogService.logChange('Membership', membership.id, 'create', null, membership);

        return membership;
    });
};

exports.updateMembership = async (id, userId, gymId, startDate, endDate, isActive) => {
    return await prisma.$transaction(async (prisma) => {
        const oldMembership = await prisma.membership.findUnique({
            where: { id }
        });

        const membership = await prisma.membership.update({
            where: { id },
            data: {
                userId,
                gymId,
                startDate,
                endDate,
                isActive
            }
        });

        await auditLogService.logChange('Membership', membership.id, 'update', oldMembership, membership);

        return membership;
    });
};

exports.deleteMembership = async (id) => {
    return await prisma.$transaction(async (prisma) => {
        const membership = await prisma.membership.delete({
            where: { id }
        });

        await auditLogService.logChange('Membership', id, 'delete', membership, null);

        return membership;
    });
};
