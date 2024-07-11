const prisma = require("../prisma/client");
const fs = require("fs").promises;
const path = require("path");

const createGym = async (gymData, file) => {
  const { name, address, phone_number, email } = gymData;
  const newGym = await prisma.gym.create({
    data: { name, address, phoneNumber: phone_number, email },
  });

  if (file) {
    const uploadDir = path.join(__dirname, "../uploads/logos");
    await fs.mkdir(uploadDir, { recursive: true });

    const imagePath = path.join(uploadDir, `${newGym.id}-${file.originalname}`);
    await fs.writeFile(imagePath, file.buffer);

    const gymLogoUrl = `/uploads/logos/${newGym.id}-${file.originalname}`;
    await prisma.gym.update({
      where: { id: newGym.id },
      data: { logo: gymLogoUrl },
    });

    newGym.logo = gymLogoUrl; // Add the logo URL to the newGym object
  }

  return newGym;
};

const editGym = async (gymData, file, id) => {
  const { name, address, phone_number, email, owner } = gymData;
  console.log(gymData, id)
  const newGym = await prisma.gym.update({
    where: { id: parseInt(id) },
    data: { name, address, phoneNumber: phone_number, email, owner },
  });

  if (file) {
    const uploadDir = path.join(__dirname, "../uploads/logos");
    await fs.mkdir(uploadDir, { recursive: true });

    const imagePath = path.join(uploadDir, `${newGym.id}-${file.originalname}`);
    await fs.writeFile(imagePath, file.buffer);

    const gymLogoUrl = `/uploads/logos/${newGym.id}-${file.originalname}`;
    await prisma.gym.update({
      where: { id: newGym.id },
      data: { logo: gymLogoUrl },
    });

    newGym.logo = gymLogoUrl; // Add the logo URL to the newGym object
  }

  return newGym;
};

const getGymById = async (id) => {
  return await prisma.gym.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

const canDeleteOrDisableGym = async (gymId) => {
  const gym = await prisma.gym.findUnique({
    where: { id: parseInt(gymId, 10) },
    select: {
      status: true,
      _count: {
        select: {
          users: true,
          products: true,
          transactions: true,
        },
      },
    },
  });

  const canDelete = Object.values(gym._count).every((count) => count === 0);
  const canDisable = gym.status !== "Disabled";

  return { canDelete, canDisable };
};

const getGyms = async (req) => {
  const gyms = await prisma.gym.findMany({where:{ id: req.user.fillters.gymId}});

  const gymIds = gyms.map((gym) => gym.id);
  const constraints = await prisma.gym.findMany({
    where: { id: { in: gymIds } },
    select: {
      id: true,
      status: true,
      _count: {
        select: {
          users: true,
          products: true,
          transactions: true,
        },
      },
    },
  });

  const gymsWithConstraints = gyms.map((gym) => {
    const gymConstraint = constraints.find(
      (constraint) => constraint.id === gym.id
    );
    const canDelete = Object.values(gymConstraint._count).every(
      (count) => count === 0
    );
    const canDisable = gymConstraint.status !== "Disabled";
    return { ...gym, canDelete, canDisable };
  });

  return gymsWithConstraints;
};

const deleteGymById = async (id) => {
  const { canDelete } = await canDeleteOrDisableGym(id);

  if (!canDelete) {
    return await prisma.gym.update({
      where: { id: parseInt(id, 10) },
      data: { status: "Disabled" },
    });
  }

  return await prisma.gym.delete({
    where: { id: parseInt(id, 10) },
  });
};

const updateGymStatusById = async (id, status) => {
  return await prisma.gym.update({
    where: { id: parseInt(id, 10) },
    data: { status },
  });
};

module.exports = {
  createGym,
  getGyms,
  getGymById,
  deleteGymById,
  updateGymStatusById,
  editGym,
};
