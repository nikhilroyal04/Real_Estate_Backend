const express = require('express');
const RoleService = require('../../services/roles/role_service');
const ConsoleManager = require('../../utils/consoleManager');
const ResponseManager = require('../../utils/responseManager');
const router = express.Router();

// Create a new role
router.post('/addRole', async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.roleName) {
      return ResponseManager.handleBadRequestError(res, 'RoleName is required');
    }
    if (!req.body.createdBy) {
      return ResponseManager.handleBadRequestError(res, 'CreatedBy is required');
    }
    if (req.body.status === undefined) {  // Check for undefined to allow falsey values like ''
      return ResponseManager.handleBadRequestError(res, 'Status is required');
    }
    if (!req.body.permission) {
      return ResponseManager.handleBadRequestError(res, 'Permission is required');
    }

    // Create a new role
    const role = await RoleService.createRole({
      roleName: req.body.roleName,
      createdBy: req.body.createdBy,
      createdOn: req.body.createdOn,
      updatedOn: req.body.updatedOn,
      status: req.body.status,
      permission: req.body.permission
    });

    ConsoleManager.log(`Role created: ${JSON.stringify(role)}`);
    return ResponseManager.sendSuccess(res, role, 201, 'Role created successfully');
  } catch (err) {
    ConsoleManager.error(`Error creating role: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error creating role: ${err.message}`);
  }
});

// Get a role by ID
router.get('/getRole/:id', async (req, res) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    if (!role) {
      return ResponseManager.handleNotFoundError(res, 'Role not found');
    }
    ConsoleManager.log(`Role fetched: ${JSON.stringify(role)}`);
    return ResponseManager.sendSuccess(res, role, 200, 'Role fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching role: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching role: ${err.message}`);
  }
});

// Update a role by ID
router.put('/updateRole/:id', async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.roleName) {
      return ResponseManager.handleBadRequestError(res, 'RoleName is required');
    }
    if (!req.body.createdBy) {
      return ResponseManager.handleBadRequestError(res, 'CreatedBy is required');
    }
    if (req.body.status === undefined) {  // Check for undefined to allow falsey values like ''
      return ResponseManager.handleBadRequestError(res, 'Status is required');
    }
    if (!req.body.permission) {
      return ResponseManager.handleBadRequestError(res, 'Permission is required');
    }

    // Update the role
    const role = await RoleService.updateRole(req.params.id, {
      roleName: req.body.roleName,
      createdBy: req.body.createdBy,
      createdOn: req.body.createdOn ,
      updatedOn: req.body.updatedOn ,
      status: req.body.status,
      permission: req.body.permission
    });

    if (!role) {
      return ResponseManager.handleNotFoundError(res, 'Role not found');
    }

    ConsoleManager.log(`Role updated: ${JSON.stringify(role)}`);
    return ResponseManager.sendSuccess(res, role, 200, 'Role updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating role: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating role: ${err.message}`);
  }
});

// Delete a role by ID
router.delete('/deleteRole/:id', async (req, res) => {
  try {
    const role = await RoleService.deleteRole(req.params.id);
    if (!role) {
      return ResponseManager.handleNotFoundError(res, 'Role not found');
    }

    ConsoleManager.log(`Role deleted: ${JSON.stringify(role)}`);
    return ResponseManager.sendSuccess(res, [], 200, 'Role deleted successfully');
  } catch (err) {
    ConsoleManager.error(`Error deleting role: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error deleting role: ${err.message}`);
  }
});

// Get all roles
router.get('/allRoles', async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    ConsoleManager.log(`Roles fetched: ${JSON.stringify(roles)}`);
    return ResponseManager.sendSuccess(res, roles, 200, 'Roles fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching roles: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching roles: ${err.message}`);
  }
});

// Update role status (active/inactive) using PUT
router.put('/removeRole/:id', async (req, res) => {
  try {
    // Check for required status field
    if (req.body.status === undefined) {  // Check for undefined to allow falsey values like ''
      return ResponseManager.handleBadRequestError(res, 'Status is required');
    }

    // Update the role status
    const role = await RoleService.updateRole(req.params.id, {
      status: req.body.status,
      updatedOn: new Date().toISOString()
    });

    if (!role) {
      return ResponseManager.handleNotFoundError(res, 'Role not found');
    }

    ConsoleManager.log(`Role status updated: ${JSON.stringify(role)}`);
    return ResponseManager.sendSuccess(res, role, 200, 'Role status updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating role status: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating role status: ${err.message}`);
  }
});

module.exports = router;
