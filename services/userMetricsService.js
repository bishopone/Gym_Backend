const prisma = require("../prisma/client");

// Upsert User Metrics
const upsertUserMetrics = async (userId, height, weight) => {
  const bmi = calculateBMI(height, weight);

  // Update the history table before upserting
  const existingMetrics = await prisma.userMetrics.findUnique({
    where: { userId: userId },
  });

  if (existingMetrics) {
    await prisma.userMetricsHistory.create({
      data: {
        userMetricsId: existingMetrics.id,
        height: existingMetrics.height,
        weight: existingMetrics.weight,
        bmi: existingMetrics.bmi,
      },
    });
  }

  // Upsert user metrics
  const updatedMetrics = await prisma.userMetrics.upsert({
    where: { userId: userId },
    update: { height, weight, bmi },
    create: { userId, height, weight, bmi },
  });

  return updatedMetrics;
};

// Retrieve User Metrics
const getUserMetrics = async (userId) => {
  const userMetrics = await prisma.userMetrics.findUnique({
    where: { userId: userId },
    include: { user: true },
  });

  return userMetrics;
};

// Retrieve User Metrics History
const getUserMetricsHistory = async (userMetricsId) => {
  const metricsHistory = await prisma.userMetricsHistory.findMany({
    where: { userMetricsId: userMetricsId },
    orderBy: { changeDate: 'desc' },
  });

  return metricsHistory;
};

// Track User Attendance
const trackAttendance = async (userId, checkInTime, checkOutTime) => {
  const attendance = await prisma.userAttendance.create({
    data: {
      userId,
      attendanceDate: new Date(),
      checkInTime,
      checkOutTime,
    },
  });

  return attendance;
};

// Get User Attendance
const getUserAttendance = async (userId) => {
  const attendance = await prisma.userAttendance.findMany({
    where: { userId: userId },
    orderBy: { attendanceDate: 'desc' },
  });

  return attendance;
};

// Count User Gym Visits for a Period
const countUserGymVisits = async (userId, startDate, endDate) => {
  const attendanceCount = await prisma.userAttendance.count({
    where: {
      userId: userId,
      attendanceDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });

  return attendanceCount;
};

// Calculate BMI
const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  return (weight / Math.pow(height / 100, 2)).toFixed(2); // BMI = weight (kg) / (height (m))^2
};

// Export all service functions
module.exports = {
  upsertUserMetrics,
  getUserMetrics,
  getUserMetricsHistory,
  trackAttendance,
  getUserAttendance,
  countUserGymVisits,
  calculateBMI,
};
