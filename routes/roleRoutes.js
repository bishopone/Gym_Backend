const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('', roleController.createRole);
router.get('', roleController.getAllRoles);
router.get('/:roleId', roleController.getRoleById);
router.put('/bulk-update', roleController.bulkUpdateRoles);
router.put('/:roleId', roleController.updateRole);
router.delete('/:roleId', roleController.deleteRole);
router.post('/assign', roleController.assignRoleToUser);

module.exports = router;
