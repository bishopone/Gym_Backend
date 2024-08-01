const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRole = async (roleData) => {
    // Find the highest hierarchyLevel for the same gymId
    const highestRole = await prisma.role.findFirst({
        where: {
            gymId: roleData.gymId || null,
        },
        orderBy: {
            hierarchyLevel: 'desc',
        },
    });

    // If no hierarchyLevel provided, set it to highestRole.hierarchyLevel + 1
    if (!roleData.hierarchyLevel) {
        roleData.hierarchyLevel = highestRole ? highestRole.hierarchyLevel + 1 : 1;
    }

    return await prisma.role.create({
        data: roleData,
    });
};


exports.getAllRoles = async () => {
    return await prisma.role.findMany({
        orderBy: {
            hierarchyLevel: 'asc',
        },
    });
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
    // Get the role to delete
    const roleToDelete = await prisma.role.findUnique({
        where: { id: parseInt(roleId, 10) },
    });

    if (!roleToDelete) {
        throw new Error('Role not found');
    }

    // Delete the role
    await prisma.role.delete({
        where: { id: parseInt(roleId, 10) },
    });

    // Reorder hierarchy levels for roles with the same gymId
    const roles = await prisma.role.findMany({
        where: {
            gymId: roleToDelete.gymId,
        },
        orderBy: {
            hierarchyLevel: 'asc',
        },
    });

    // Update hierarchy levels
    for (let i = 0; i < roles.length; i++) {
        await prisma.role.update({
            where: { id: roles[i].id },
            data: { hierarchyLevel: i + 1 },
        });
    }
};

exports.assignRoleToUser = async (userId, roleId) => {
    return await prisma.userRole.create({
        data: {
            userId: parseInt(userId, 10),
            roleId: parseInt(roleId, 10),
        },
    });
};


exports.bulkUpdateRoles = async (rolesData) => {
    console.log(rolesData)
    const updatePromises = rolesData.map(role => {
        return prisma.role.update({
            where: { id: parseInt(role.id, 10) },
            data: { hierarchyLevel: role.hierarchyLevel },
        });
    });

    return await Promise.all(updatePromises);
};
