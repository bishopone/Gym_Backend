const prisma = require("../prisma/client"); // Make sure to adjust the import according to your setup
const {json} = require("../utils/json");

const getMembersPerDay = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const totalMembers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: "Active",
        roles: {
          some: {
            roleId: 3
          }
        }
      }
    });

    res.status(200).json({ totalMembers });
  } catch (error) {
    console.error("Error getting total members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTotalMembers = async (req, res) => {
  try {
    const totalMembers = await prisma.user.count({
      where: { status: "Active", roles:{some: {
        roleId: 3
      }} },
    });
    res.status(200).json({ totalMembers });
  } catch (error) {
    console.error("Error getting total members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getMembershipRegisteredPerDay = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // const users = await prisma.user.findMany({
    //   where: {
    //     subscriptions: {
    //       some: {
    //         endDate: {
    //           gte: today,
    //           lt: endOfWeek,
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     subscriptions: { include: { subscriptionType: true } },
    //     roles: { include: { role: { select: { roleName: true } } } },
    //   },
    // });
  
    const totalMembers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        status: "Active",
        roles: {
          some: {
            roleId: 3
          }
        }
      },
          include: {
        subscriptions: { include: { subscriptionType: true } },
        roles: { include: { role: { select: { roleName: true } } } },
      },
    });
    console.log(totalMembers)
    res.status(200).json(formatUsers(totalMembers));
  } catch (error) {
    console.error("Error getting total members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const formatUsers = (users) => {
  return users.map((user) => ({
    ...user,
    roleName: user.roles.length === 0 ? "" : user.roles[0].role.roleName,
    role: user.roles.length === 0 ? "" : user.roles[0].roleId,
  }));
};

const getActiveMembers = async (req, res) => {
  try {
    const now = new Date(); // Get the current date and time

    const activeMembers = await prisma.user.count({
      where: {
        status: "Active",
        roles:{
          some: {
          roleId: 3
        }},
        subscriptions: {
          some: {
            endDate: {
              gt: now, // Compare endDate to current date using 'gt' (greater than)
            },
          },
        },
      },
    });

    res.status(200).json({ activeMembers });
  } catch (error) {
    console.error("Error getting active members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMembershipExpirationsPerDay = async (req, res) => {
    try {
      const result = await prisma.$queryRaw`
        SELECT 
          DATE(endDate) AS date, 
          COUNT(*) AS count
        FROM UserSubscription
        GROUP BY DATE(endDate)
      `;
      const formattedResult = result.map((val) => ({
        date: val.date, // `val.date` is already a string representing the date
        count: parseInt(val.count, 10), // Ensure count is an integer
      }));
      res.status(200).send(json(formattedResult));
    } catch (error) {
      console.error("Error getting membership expirations per day:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const getMembershipRenewalsPerDay = async (req, res) => {
    try {
      const userSubscriptions = await prisma.userSubscription.findMany({
        orderBy: 
          [{userId: 'asc',},
          {startDate: 'asc',}]
        ,
      });
  
      const renewalsPerDay = userSubscriptions.reduce((acc, subscription, index, array) => {
        // Find the previous subscription for the same user
        const previousSubscription = array
          .slice(0, index)
          .reverse()
          .find(sub => sub.userId === subscription.userId);
  
        if (previousSubscription && subscription.startDate > previousSubscription.endDate) {
          const date = new Date(subscription.startDate);
          const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
          if (!acc[formattedDate]) {
            acc[formattedDate] = { date: formattedDate, renewals: 0 };
          }
  
          acc[formattedDate].renewals += 1;
        }
  
        return acc;
      }, {});
  
      const formattedData = Object.values(renewalsPerDay);
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error getting membership renewals per day:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  

  const getRevenuePerMonth = async (req, res) => {
  try {
    // Get the current year and month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // months are 0-indexed in JavaScript

    // Get payments grouped by year and month
    const groupedPayments = await prisma.$queryRaw`
      SELECT
        YEAR ("createdAt") AS year,
        MONTH("createdAt") AS month,
        SUM("amount") AS totalAmount,
        COUNT(*) AS paymentCount
      FROM Payment
      GROUP BY year, month
    `;
    console.log(groupedPayments)
    console.log(currentYear, currentMonth)

    // Get payments for the current month
    const currentMonthPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
      include: {
        transaction: true,
      },
    });

    // Split transactions by status
    const paymentStatus = {
      UnPaid: 0,
      Paid: 0,
    };

    console.log(currentMonthPayments)
    currentMonthPayments.forEach(payment => {
      if (payment.transaction.status === 'UnPaid') {
        paymentStatus.UnPaid += payment.amount;
      } else if (payment.transaction.status === 'Paid') {
        paymentStatus.Paid += payment.amount;
      }
    });

    res.status(200).send(json({
      groupedPayments,
      currentMonthPayments: {
        payments: currentMonthPayments,
        statusSummary: paymentStatus,
      },
    }));
  } catch (error) {
    console.error("Error getting revenue per month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPopularClasses = async (req, res) => {
  try {
    const popularSubscriptions = await prisma.subscriptionType.findMany({
      include: {
        userSubscriptions: {
          include: {
            Transaction: {
              select: {
                amount: true
              }
            }
          }
        }
      }
    });

    const result = popularSubscriptions.map(subscription => {
      const totalAmountPaid = subscription.userSubscriptions.reduce((sum, userSubscription) => {
        return sum + userSubscription.Transaction.reduce((transactionSum, transaction) => {
          return transactionSum + transaction.amount;
        }, 0);
      }, 0);

      return {
        subscriptionType: subscription,
        numberOfSubscriptions: subscription.userSubscriptions.length,
        totalAmountPaid
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMembersPerDay,
  getTotalMembers,
  getActiveMembers,
  getMembershipRenewalsPerDay,
  getMembershipExpirationsPerDay,
  getMembershipRegisteredPerDay,
  getRevenuePerMonth,
  getPopularClasses,
};
