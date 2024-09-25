const Lead = require("../../models/leads/lead_model"); // Adjust the path as needed

// Create a new lead
const createLead = async (leadData) => {
  try {
    const newLead = new Lead(leadData);
    return await newLead.save();
  } catch (error) {
    throw new Error(`Error creating lead: ${error.message}`);
  }
};

// Get all leads
const getAllLeads = async (query = {}, page = 1, limit = 20) => {
  try {
    const leads = await Lead.find(query)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    return leads;
  } catch (error) {
    throw new Error(`Error fetching leads: ${error.message}`);
  }
};

// Get a lead by ID
const getLeadById = async (id) => {
  try {
    return await Lead.findById(id);
  } catch (error) {
    throw new Error(`Error fetching lead by ID: ${error.message}`);
  }
};

// Update a lead by ID
const updateLead = async (id, leadData) => {
  try {
    leadData.updatedon = Date.now();
    return await Lead.findByIdAndUpdate(id, leadData, { new: true });
  } catch (error) {
    throw new Error(`Error updating lead: ${error.message}`);
  }
};

// Update lead status by ID
const updateLeadStatus = async (id, status) => {
  try {
    // Validate status value
    if (!["Active", "Disabled"].includes(status)) {
      throw new Error("Invalid status value");
    }
    return await Lead.findByIdAndUpdate(
      id,
      { status, updatedon: Date.now() },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating lead status: ${error.message}`);
  }
};

// Delete a lead by ID
const deleteLead = async (id) => {
  try {
    return await Lead.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting lead: ${error.message}`);
  }
};

const getNumberOfLeads = async (query = {}) => {
  try {
    const count = await Lead.countDocuments(query);
    return count;
  } catch (err) {
    throw new Error(`Error counting leads: ${err.message}`);
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getNumberOfLeads,
};
