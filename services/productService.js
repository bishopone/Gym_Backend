const { PrismaClient } = require("@prisma/client");
const connect = require("connect-sqlite3");
const prisma = new PrismaClient();

exports.createProduct = async (productData, userId) => {
  const {
    productName,
    productDescription,
    productType,
    price,
    durationMonths,
    stock,
    gymId,
    productImageUrl,
  } = productData;

  return await prisma.product.create({
    data: {
      productName,
      productDescription,
      productType,
      price,
      durationMonths,
      stock,
      productImageUrl,
      createdBy: {
        connect: { id: userId },
      },
      gym: {
        connect: { id: gymId },
      },
    },
  });
};

exports.getProduct = async (productId) => {
  return await prisma.product.findUnique({
    where: { id: productId },
  });
};

exports.getAllProducts = async (filter, page, limit) => {
  const skip = (page - 1) * limit;
  const products = await prisma.product.findMany({
    where: filter,
    skip: parseInt(skip, 10),
    take: parseInt(limit, 10),
  });
  const total = await prisma.product.count({ where: filter });
  return {
    products,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
};
