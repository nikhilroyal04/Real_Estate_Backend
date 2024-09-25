const Property = require("../../models/properties/prop_model");
const consoleManager = require("../../utils/consoleManager");

class PropertyService {
  async createProperty(data) {
    try {
      // Manually set createdOn and updatedOn to current date if not provided
      data.createdOn = Date.now();
      data.updatedOn = Date.now();

      const property = new Property(data);
      await property.save();
      consoleManager.log("Property created successfully");
      return property;
    } catch (err) {
      consoleManager.error(`Error creating property: ${err.message}`);
      throw err;
    }
  }

  async getPropertyById(propertyId) {
    try {
      const property = await Property.findById(propertyId);
      if (!property) {
        consoleManager.error("Property not found");
        return null;
      }
      return property;
    } catch (err) {
      consoleManager.error(`Error fetching property: ${err.message}`);
      throw err;
    }
  }

  async updateProperty(propertyId, data) {
    try {
      data.updatedOn = Date.now();
      const property = await Property.findByIdAndUpdate(propertyId, data, {
        new: true,
      });
      if (!property) {
        consoleManager.error("Property not found for update");
        return null;
      }
      consoleManager.log("Property updated successfully");
      return property;
    } catch (err) {
      consoleManager.error(`Error updating property: ${err.message}`);
      throw err;
    }
  }

  async deleteProperty(propertyId) {
    try {
      const property = await Property.findByIdAndDelete(propertyId);
      if (!property) {
        consoleManager.error("Property not found for deletion");
        return null;
      }
      consoleManager.log("Property deleted successfully");
      return property;
    } catch (err) {
      consoleManager.error(`Error deleting property: ${err.message}`);
      throw err;
    }
  }

  async getAllProperties(query = {}, skip = 0, limit = 20) {
    try {
      const properties = await Property.find(query).skip(skip).limit(limit);
      consoleManager.log(`Fetched ${properties.length} properties`);
      return properties;
    } catch (err) {
      consoleManager.error(`Error fetching properties: ${err.message}`);
      throw err;
    }
  }

  async getTotalCount(query = {}) {
    try {
      const count = await Property.countDocuments(query);
      consoleManager.log(`Total properties count: ${count}`);
      return count;
    } catch (err) {
      consoleManager.error(`Error counting properties: ${err.message}`);
      throw err;
    }
  }

  async updatePropertyStatus(propertyId, newStatus) {
    try {
      const property = await Property.findById(propertyId);
      if (!property) {
        consoleManager.error("Property not found for status update");
        return null;
      }

      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { status: newStatus, updatedOn: Date.now() },
        { new: true }
      );

      consoleManager.log(`Property status updated to ${newStatus}`);
      return updatedProperty;
    } catch (err) {
      consoleManager.error(`Error updating property status: ${err.message}`);
      throw err;
    }
  }

  // New method to get the number of properties
  async getNumberOfProperties() {
    try {
      const count = await Property.countDocuments();
      consoleManager.log(`Number of properties: ${count}`);
      return count;
    } catch (err) {
      consoleManager.error(`Error counting properties: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new PropertyService();
