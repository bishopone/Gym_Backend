const roleService = require('../services/roleService');

exports.createRole = async (req, res) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await roleService.getRoleById(req.params.roleId);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await roleService.updateRole(req.params.roleId, req.body);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        await roleService.deleteRole(req.params.roleId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkUpdateRoles = async (req, res) => {
    try {
        await roleService.bulkUpdateRoles(req.body.data);
        res.status(200).json({ message: 'Roles updated successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};


exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const userRole = await roleService.assignRoleToUser(userId, roleId);
    res.status(201).json(userRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
