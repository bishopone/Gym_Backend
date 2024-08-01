// middleware/checkRoleHierarchy.js
const prisma = require('../prisma/client');

const checkRoleHierarchy = () => {
  return async (req, res, next) => {
    try {
      console.log('selam')
      const currentUserId = parseInt(req.user.id);
      const userIdToDelete = parseInt(req.params.id);

      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { roles: { include: { role: true } } }
      });

      const userToDelete = await prisma.user.findUnique({
        where: { id: userIdToDelete },
        include: { roles: { include: { role: true } } }
      });

      if (!currentUser || !userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const currentUserRole = currentUser.roles[0].role;
      const userToDeleteRole = userToDelete.roles[0].role;
      console.log(currentUserRole,userToDeleteRole  )
      console.log(currentUserRole.hierarchyLevel <= userToDeleteRole.hierarchyLevel  )

      if (currentUserRole.hierarchyLevel >= userToDeleteRole.hierarchyLevel) {
        return res.status(403).json({ error: 'You do not have permission to delete this user' });
      }

      next();
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = checkRoleHierarchy;
