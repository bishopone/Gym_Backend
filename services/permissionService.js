const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPermission = async (permissionData) => {
    return await prisma.permission.create({
        data: permissionData,
    });
};

exports.getAllPermissions = async () => {
    return await prisma.permission.findMany();
};

exports.getPermissionById = async (permissionId) => {
    return await prisma.permission.findUnique({
        where: { id: parseInt(permissionId, 10) },
    });
};


exports.getPermissionsByRoleId = async (roleIds) => {
    roleIds = roleIds.map((id)=> parseInt(id))
    return await prisma.rolePermission.findMany({
        where: { roleId: {in: roleIds} },
        include: {
            permission: true,
        },
    });
};

exports.updatePermissionState = async (roleId, permissionId, enabled) => {
    try {
    //   const existingRecord = await prisma.rolePermission.findUnique({
    //     where: {
    //       roleId_permissionId: {
    //         roleId,
    //         permissionId,
    //       },
    //     },
    //   });
  
      if (!enabled) {
        // If record exists, delete it
        await prisma.rolePermission.delete({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId,
            },
          },
        });
      } else {
        // If record doesn't exist, insert it
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        });
      }
  
      // Optionally, return a success message or handle further logic
      return { message: 'Permission state updated successfully' };
    } catch (error) {
      throw new Error(`Error updating permission state: ${error.message}`);
    } finally {
      await prisma.$disconnect(); // Ensure to disconnect Prisma client after operation
    }
  };

exports.updatePermission = async (permissionId, permissionData) => {
    return await prisma.permission.update({
        where: { id: parseInt(permissionId, 10) },
        data: permissionData,
    });
};

exports.deletePermission = async (permissionId) => {
    return await prisma.permission.delete({
        where: { id: parseInt(permissionId, 10) },
    });
};
