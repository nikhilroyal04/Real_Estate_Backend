// services/role_services.js
const Role = require("../../models/roles/role_model");
const consoleManager = require("../../utils/consoleManager");

class RoleService {
  async createRole(data) {
    try {
      // Manually set createdOn and updatedOn to current date if not provided
      data.createdOn = data.createdOn || Date.now();
      data.updatedOn = data.updatedOn || Date.now();

      const role = new Role(data);
      await role.save();
      consoleManager.log("Role created successfully");
      return role;
    } catch (err) {
      consoleManager.error(`Error creating role: ${err.message}`);
      throw err;
    }
  }

  async getRoleById(roleId) {
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        consoleManager.error("Role not found");
        return null;
      }
      return role;
    } catch (err) {
      consoleManager.error(`Error fetching role: ${err.message}`);
      throw err;
    }
  }

  async updateRole(roleId, data) {
    try {
      data.updatedOn = Date.now(); // Manually set updatedOn
      const role = await Role.findByIdAndUpdate(roleId, data, { new: true });
      if (!role) {
        consoleManager.error("Role not found for update");
        return null;
      }
      consoleManager.log("Role updated successfully");
      return role;
    } catch (err) {
      consoleManager.error(`Error updating role: ${err.message}`);
      throw err;
    }
  }

  async deleteRole(roleId) {
    try {
      const role = await Role.findByIdAndDelete(roleId);
      if (!role) {
        consoleManager.error("Role not found for deletion");
        return null;
      }
      consoleManager.log("Role deleted successfully");
      return role;
    } catch (err) {
      consoleManager.error(`Error deleting role: ${err.message}`);
      throw err;
    }
  }

  async getAllRoles() {
    try {
      const roles = await Role.find();
      return roles;
    } catch (err) {
      consoleManager.error(`Error fetching roles: ${err.message}`);
      throw err;
    }
  }

  async toggleRoleStatus(roleId) {
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        consoleManager.error("Role not found for status toggle");
        return null;
      }

      const newStatus = role.status === "active" ? "inactive" : "active";
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        { status: newStatus, updatedOn: new Date.now() },
        { new: true }
      );

      consoleManager.log(`Role status updated to ${newStatus}`);
      return updatedRole;
    } catch (err) {
      consoleManager.error(`Error toggling role status: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new RoleService();
