const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  // Hash the superuser password
  const hashedPassword = await bcrypt.hash(process.env.SUPERUSER_PASSWORD, 10);

  // Create permissions for each table operation
  const permissions = [
    'CREATE_GYM', 'READ_GYM', 'UPDATE_GYM', 'DELETE_GYM','UPDATE_GYM_STATUS',
    'CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER','ASIGN_GYM',
    'CREATE_REMEMBER_ME_TOKEN', 'READ_REMEMBER_ME_TOKEN', 'UPDATE_REMEMBER_ME_TOKEN', 'DELETE_REMEMBER_ME_TOKEN',
    'CREATE_ROLE', 'READ_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE',
    'CREATE_USER_ROLE', 'READ_USER_ROLE', 'UPDATE_USER_ROLE', 'DELETE_USER_ROLE',
    'CREATE_PERMISSION', 'READ_PERMISSION', 'UPDATE_PERMISSION', 'DELETE_PERMISSION',
    'CREATE_ROLE_PERMISSION', 'READ_ROLE_PERMISSION', 'UPDATE_ROLE_PERMISSION', 'DELETE_ROLE_PERMISSION',
    'CREATE_SUBSCRIPTION', 'READ_SUBSCRIPTION', 'UPDATE_SUBSCRIPTION', 'DELETE_SUBSCRIPTION',
    'CREATE_PRODUCT', 'READ_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT',
    'CREATE_TRANSACTION', 'READ_TRANSACTION', 'UPDATE_TRANSACTION', 'DELETE_TRANSACTION',
    'CREATE_TRANSACTION_DETAIL', 'READ_TRANSACTION_DETAIL', 'UPDATE_TRANSACTION_DETAIL', 'DELETE_TRANSACTION_DETAIL',
    'CREATE_PAYMENT', 'READ_PAYMENT', 'UPDATE_PAYMENT', 'DELETE_PAYMENT'
  ];

  const permissionPromises = permissions.map(permissionName => prisma.permission.create({
    data: { permissionName }
  }));

  const createdPermissions = await Promise.all(permissionPromises);

  // Create the superadmin role with all permissions
  const superadminRole = await prisma.role.create({
    data: {
      roleName: 'SUPERADMIN',
      permissions: {
        create: createdPermissions.map(permission => ({
          permission: {
            connect: {
              id: permission.id,
            },
          },
        })),
      },
    },
  });
  await prisma.role.create({
    data: {
      roleName: 'Admin',
    },
  });
  await prisma.role.create({
    data: {
      roleName: 'Member',
    },
  });
  // Create the superuser
  const superuser = await prisma.user.create({
    data: {
      email: process.env.SUPERUSER_EMAIL,
      password: hashedPassword,
      username: process.env.SUPERUSER_USERNAME,
      name: process.env.SUPERUSER_NAME,
      roles: {
        create: {
          role: {
            connect: {
              id: superadminRole.id,
            },
          },
        },
      },
    },
  });

  console.log('Superuser created:', superuser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
