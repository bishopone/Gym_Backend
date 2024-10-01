const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createSubscriptionService } = require("./subscriptionService");
const { upsertUserMetrics } = require("./userMetricsService");
require("dotenv").config();

const generateUniqueUsername = async (name) => {
  let username = name.toLowerCase().replace(/\s+/g, "");
  let uniqueNumber = Math.floor(Math.random() * 10000);
  let finalUsername = `${username}${uniqueNumber}`;
  while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
    uniqueNumber = Math.floor(Math.random() * 10000);
    finalUsername = `${username}${uniqueNumber}`;
  }
  return finalUsername;
};

const saveProfileImage = async (userId, file) => {
  const hdUploadDir = path.join(__dirname, "../uploads/profile/hd");
  const sdUploadDir = path.join(__dirname, "../uploads/profile/sd");

  if (!fs.existsSync(hdUploadDir)) {
    fs.mkdirSync(hdUploadDir, { recursive: true });
  }
  if (!fs.existsSync(sdUploadDir)) {
    fs.mkdirSync(sdUploadDir, { recursive: true });
  }

  const hdImagePath = path.join(hdUploadDir, `${userId}-${file.name}`);
  const sdImagePath = path.join(sdUploadDir, `${userId}-${file.name}`);

  await sharp(file.data).toFile(hdImagePath);
  await sharp(file.data).resize(200, 200).toFile(sdImagePath); // Adjust the size as needed

  return {
    hd: `/uploads/profile/hd/${userId}-${file.name}`,
    sd: `/uploads/profile/sd/${userId}-${file.name}`,
  };
};

exports.registerUser = async (userData, file, user) => {
  var {
    email,
    password,
    name,
    phoneNumber,
    gymId,
    role,
    subscription,
    age,
    sex,
    weight,
    height,
  } = userData;

  if (!gymId) {
    gymId = user.gymId;
  }
  if (!role) {
    role = "3";
  }

  const username = await generateUniqueUsername(name);
  var newpassword = password;

  if (!password) {
    newpassword = "123456";
  }
  const hashedPassword = await bcrypt.hash(newpassword, 10);

  const newUser = await prisma.user.upsert({
    where: {
      phoneNumber,
    },
    update: {
      status: "Active",
    },

    create: {
      email,
      password: hashedPassword,
      username,
      name,
      age,
      sex,
      phoneNumber,
      gymId: parseInt(gymId),
    },
  });

  if (file) {
    const { hd, sd } = await saveProfileImage(newUser.id, file);
    await prisma.user.update({
      where: { id: newUser.id },
      data: { profileImageUrl: hd },
    });
  }
  if (role) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: newUser.id, roleId: parseInt(role) } },
      update: {
        roleId: parseInt(role),
      },
      create: {
        userId: newUser.id,
        roleId: parseInt(role),
      },
    });
  }
  if (subscription) {
    const currentDate = new Date(); // Get the current date and time

    const data = {
      userId: newUser.id,
      subscriptionTypeId: parseInt(subscription),
      startDate: currentDate.toISOString(), // Get the current date and time
    };
    await createSubscriptionService(data);
  }

  if (age || sex || weight || height) {
    console.log(age, sex, weight, height);
    await upsertUserMetrics(newUser.id, height, weight);

  }

  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      }
    );
    return { user, token };
  }
  throw new Error("Invalid email or password");
};

exports.validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (user) {
      return user;
    }
    throw new Error("User not found");
  } catch (error) {
    throw new Error("Invalid token");
  }
};

exports.updateUser = async (userId, userData, file) => {
  const {
    email,
    oldPassword,
    newPassword,
    confirmPassword,
    name,
    phoneNumber,
    gymId,
    role,
    age,
    sex,
    subscription,
  } = userData;
  console.log("userData");
  console.log(userData);
  const data = {
    email,
    name,
    phoneNumber,
    age,
    sex,
  };
  if (gymId) {
    data.gymId = parseInt(gymId);
  }
  if (oldPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      if (newPassword === confirmPassword) {
        data.password = await bcrypt.hash(newPassword, 10);
      }
    }
  }
  const newUser = await prisma.user.update({
    where: { id: userId },
    data: data,
  });

  if (file) {
    const { hd, sd } = await saveProfileImage(newUser.id, file);
    await prisma.user.update({
      where: { id: newUser.id },
      data: { profileImageUrl: hd },
    });
  }
  if (role) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: newUser.id, roleId: parseInt(role) } },
      update: {
        roleId: parseInt(role),
      },
      create: {
        userId: newUser.id,
        roleId: parseInt(role),
      },
    });
  }

  if (subscription) {
    const currentDate = new Date(); // Get the current date and time

    const data = {
      userId: newUser.id,
      subscriptionTypeId: parseInt(subscription),
      startDate: currentDate.toISOString(), // Get the current date and time
      gymId: gymId,
    };
    await createSubscriptionService(data);
  }
  return newUser;
};

exports.getAllUsers = async (req, page, limit) => {
  const offset = (page - 1) * limit;
  console.log(req.user.fillters);
  const users = await prisma.user.findMany({
    where: req.user.fillters,
    include: {
      subscriptions: { include: { subscriptionType: true } },
      roles: { include: { role: { select: { roleName: true } } } },
    },
    skip: offset,
    take: parseInt(limit),
  });

  // Format the users data to include only roles
  const formattedUsers = users.map((user) => ({
    ...user,
    roleName: user.roles.length === 0 ? "" : user.roles[0].role.roleName,
    role: user.roles.length === 0 ? "" : user.roles[0].roleId,
  }));
  const userIds = formattedUsers.map((user) => user.id);

  const constraints = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      _count: {
        select: {
          transactions: true,
          subscriptions: true,
        },
      },
    },
  });

  const usersWithConstraints = formattedUsers.map((user) => {
    const userConstraint = constraints.find(
      (constraint) => constraint.id === user.id
    );
    const canDelete = Object.values(userConstraint._count).every(
      (count) => count === 0
    );
    const canDisable = userConstraint.status !== "Disabled";
    return { ...user, canDelete, canDisable };
  });

  const userPromises = usersWithConstraints.map(async (user) => {
    if (user.subscriptions.length > 0) {
      const subscriptions = user.subscriptions[0];
      const today = new Date();
      const timeDiff = subscriptions.endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return { ...user, subscriptions, daysLeft };
    } else {
      return { ...user };
    }
  });

  const usersData = await Promise.all(userPromises);

  const totalUsers = await prisma.user.count({
    where: req.user.fillters,
  });

  return {
    data: usersData,
    page: parseInt(page),
    limit: parseInt(limit),
    total: totalUsers,
  };
};

exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      roles: { include: { role: { select: { roleName: true } } } },
      SecretCode: true,
      transactions: true,
      UserMetrics: true,
      subscriptions: {
        include: {
          subscriptionType: { select: { id: true, name: true } },
        },
      },
    },
  });
  console.log(user)
  const formattedUsers = {
    ...user,
    SecretCode: user.SecretCode[0] ?? null,
    height: user?.UserMetrics[0]?.height,
    weight: user?.UserMetrics[0]?.weight,
    roleName: user.roles.length === 0 ? "" : user.roles[0].role.roleName,
    role: user.roles.length === 0 ? "" : user.roles[0].roleId,
    canDelete: user.transactions.length === 0,
    canDisable: user.transactions.length === 0,
  };

  if (formattedUsers.subscriptions.length > 0) {
    const subscriptions = formattedUsers.subscriptions[0];
    const today = new Date();
    const timeDiff = subscriptions.endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return { ...formattedUsers, subscriptions, daysLeft };
  } else {
    return { ...formattedUsers };
  }
};

exports.updateProfilePicture = async (userId, file) => {
  if (file) {
    const { hd, sd } = await saveProfileImage(userId, file);
    return await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: hd },
    });
  }
  throw new Error("No file provided");
};
exports.fuzzySearchUsers = async (query, roleid, gymId) => {
  let whereClause = {
    OR: [
      { email: { contains: query } },
      { username: { contains: query } },
      { name: { contains: query } },
      { phoneNumber: { contains: query } },
    ],
  };

  // Add role and gymId filtering conditions
  if (roleid !== null && roleid !== undefined) {
    if (!whereClause.AND) whereClause.AND = [];
    whereClause.AND.push({
      roles: {
        some: {
          roleId: parseInt(roleid),
        },
      },
      status: "Active",
    });
  }

  if (gymId !== null && gymId !== undefined) {
    if (!whereClause.AND) whereClause.AND = [];
    whereClause.AND.push({
      gymId: gymId,
    });
  }

  const results = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phoneNumber: true,
      profileImageUrl: true,
      createdAt: true,
      gymId: true,
      subscriptions: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          subscriptionType: {
            select: {
              id: true,
              name: true,
              durationInDays: true,
            },
          },
        },
        orderBy: {
          endDate: "desc",
        },
        where: {
          endDate: {
            gte: new Date(), // Fetch only active subscriptions
          },
        },
        take: 1, // Limit to fetch the latest active subscription
      },
    },
    where: whereClause,
  });

  const userPromises = results.map(async (user) => {
    if (user.subscriptions.length > 0) {
      const subscriptions = user.subscriptions[0];
      const today = new Date();
      const timeDiff = subscriptions.endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return { ...user, subscriptions, daysLeft };
    } else {
      return { ...user };
    }
  });

  return Promise.all(userPromises);
};

exports.deleteUserById = async (id) => {
  const canDelete = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      _count: {
        select: {
          transactions: {
            where: {
              status: "Paid",
            },
          },
        },
      },
    },
  });
  console.log("canDelete");
  console.log(canDelete);
  if (canDelete._count.transactions === 0) {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    return user;
  }

  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      status: "Disabled",
    },
  });
  return user;
};
exports.getExpiredSubscriptions = async () => {
  const today = new Date();

  const users = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          roleId: 3,
        },
      },
      NOT: {
        subscriptions: {
          some: {
            endDate: { gt: today },
          },
        },
      },
      subscriptions: {
        some: {
          endDate: { lt: today },
        },
      },
    },
    include: {
      subscriptions: {
        where: {
          endDate: { lt: today },
        },
        include: {
          subscriptionType: true,
        },
      },
      roles: {
        include: {
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
    },
  });

  return formatUsers(users);
};

exports.getUnsubscribedUsers = async () => {
  const today = new Date();

  const users = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          roleId: 3,
        },
      },
      NOT: {
        subscriptions: {
          some: {
            OR: [
              {
                endDate: { gt: today },
              },
              {
                endDate: { lt: today },
              },
            ],
          },
        },
      },
    },
    include: {
      subscriptions: true,
      roles: {
        include: {
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
    },
  });

  return formatUsers(users);
};

exports.getExpiredToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const users = await prisma.user.findMany({
    where: {
      subscriptions: {
        some: {
          endDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    },
    include: {
      subscriptions: { include: { subscriptionType: true } },
      roles: { include: { role: { select: { roleName: true } } } },
    },
  });

  return formatUsers(users);
};

exports.getExpiringThisWeek = async () => {
  const today = new Date();
  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + (7 + today.getDay()));

  const users = await prisma.user.findMany({
    where: {
      subscriptions: {
        some: {
          endDate: {
            gte: today,
            lt: endOfWeek,
          },
        },
      },
    },
    include: {
      subscriptions: { include: { subscriptionType: true } },
      roles: { include: { role: { select: { roleName: true } } } },
    },
  });

  return formatUsers(users);
};

const formatUsers = (users) => {
  return users.map((user) => ({
    ...user,
    roleName: user.roles.length === 0 ? "" : user.roles[0].role.roleName,
    role: user.roles.length === 0 ? "" : user.roles[0].roleId,
  }));
};
