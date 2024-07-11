const permissionService = require("../services/permissionService");

exports.createPermission = async (req, res) => {
  try {
    const permission = await permissionService.createPermission(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await permissionService.getPermissionById(req.params.id);
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPermissionsByRoleId = async (req, res) => {
  try {
    console.log("ids");
    console.log(req.body);
    const ids = req.body?.ids;
    console.log(ids);

    const allPermissions = await permissionService.getAllPermissions();

    if (!ids || ids.length === 0) {
      const permissionsWithFlags = allPermissions.map((permission) => ({
        ...permission,
        enabled: false,
      }));
      res.status(200).json(permissionsWithFlags);
    } else {
      const role = await permissionService.getPermissionsByRoleId(ids);
      const enabledPermissions = role.map(
        (permission) => permission.permission
      );

      const permissionsWithFlags = allPermissions.map((permission) => ({
        ...permission,
        enabled: enabledPermissions.some(
          (enabledPermission) => enabledPermission.id === permission.id
        ),
      }));

      res.status(200).json(permissionsWithFlags);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const permission = await permissionService.updatePermission(
      req.params.id,
      req.body
    );
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePermissionAssignation = async (req, res) => {
    try {
      const { checkedRoles, permissionId , enabled} = req.body;
  
      // Validate input
      if (!Array.isArray(checkedRoles) || checkedRoles.length === 0) {
        return res.status(400).json({ error: "Checked roles must be a non-empty array" });
      }
  
      // Update permission state for each role asynchronously
      await Promise.all(
        checkedRoles.map((roleId) => permissionService.updatePermissionState(roleId, permissionId, enabled))
      );
  
      res.status(200).json({ message: "Permission states updated successfully" });
    } catch (error) {
      console.error("Error updating permission states:", error);
      res.status(500).json({ error: error.message });
    }
  };

exports.deletePermission = async (req, res) => {
  try {
    await permissionService.deletePermission(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
