const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRole = async (roleData) => {
    return await prisma.role.create({
        data: roleData,
    });
};

exports.getAllRoles = async () => {
    return await prisma.role.findMany();
};

exports.getRoleById = async (roleId) => {
    return await prisma.role.findUnique({
        where: { id: parseInt(roleId, 10) },
    });
};

exports.updateRole = async (roleId, roleData) => {
    return await prisma.role.update({
        where: { id: parseInt(roleId, 10) },
        data: roleData,
    });
};


exports.deleteRole = async (roleId) => {
    return await prisma.role.delete({
        where: { id: parseInt(roleId, 10) },
    });
};

exports.assignRoleToUser = async (userId, roleId) => {
    return await prisma.userRole.create({
        data: {
            userId: parseInt(userId, 10),
            roleId: parseInt(roleId, 10),
        },
    });
};
