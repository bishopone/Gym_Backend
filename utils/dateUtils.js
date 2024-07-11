const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const timeDifference = end.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysRemaining;
  };
  
  module.exports = { calculateRemainingDays };
  