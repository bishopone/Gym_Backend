const prisma = require('../prisma/client');

exports.createAttendance = async (userId, gymId) => {
  // Check if the user has already attended today
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      userId: userId,
      gymId: gymId,
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }
  });

  if (existingAttendance) {
    throw new Error('User has already attended today');
  }

  // Create a new attendance record
  return await prisma.attendance.create({
    data: {
      userId: userId,
      gymId: gymId,
      date: new Date()
    }
  });
};

exports.getAttendanceAnalytics = async () => {
  // Fetch attendance analytics
  const attendanceCount = await prisma.attendance.groupBy({
    by: ['gymId'],
    _count: {
      _all: true
    }
  });

  const userAttendance = await prisma.attendance.groupBy({
    by: ['userId'],
    _count: {
      _all: true
    }
  });

  return { attendanceCount, userAttendance };
};

exports.getAttendancePerUser = async () => {
  // Fetch attendance per user
  const attendancePerUser = await prisma.attendance.groupBy({
    by: ['userId'],
    _count: {
      _all: true
    }
  });

  return attendancePerUser;
};

exports.getAttendancePerWeek = async () => {
  // Fetch attendance per week
  const attendancePerWeek = await prisma.$queryRaw`
    SELECT 
      WEEK(date) as weekNumber,
      COUNT(*) as attendanceCount
    FROM Attendance
    GROUP BY WEEK(date)
  `;

  return attendancePerWeek;
};

exports.getDaysPerMonth = async () => {
  // Fetch days per month
  const daysPerMonth = await prisma.$queryRaw`
    SELECT 
      MONTH(date) as month,
      COUNT(DISTINCT DATE(date)) as daysCount
    FROM Attendance
    GROUP BY MONTH(date)
  `;

  return daysPerMonth;
};
