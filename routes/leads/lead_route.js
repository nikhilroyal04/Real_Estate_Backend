const express = require('express');
const LeadService = require('../../services/leads/lead_services'); 
const ConsoleManager = require('../../utils/consoleManager');
const ResponseManager = require('../../utils/responseManager');
const {generateLeadNo} = require('../../utils/leadNo');
const router = express.Router();

// Create a new lead
router.post('/addLead', async (req, res) => {
    try {
      // Manually check for required fields
      const { name, phoneNo, email, message, propertyNo, status } = req.body;
  
      if (!name) return ResponseManager.handleBadRequestError(res, 'Name is required');
      if (!phoneNo) return ResponseManager.handleBadRequestError(res, 'Phone number is required');
      if (!email) return ResponseManager.handleBadRequestError(res, 'Email is required');
      if (!message) return ResponseManager.handleBadRequestError(res, 'Message is required');
      if (!propertyNo) return ResponseManager.handleBadRequestError(res, 'Property number is required');
      if (!status) return ResponseManager.handleBadRequestError(res, 'Status is required');
  
      const leadNo = await generateLeadNo();
  
      // Create a new lead
      const leadData = await LeadService.createLead({
        leadNo, 
        name, phoneNo, email, message, propertyNo, status
      });
  
      ConsoleManager.log(`Lead created: ${JSON.stringify(leadData)}`);
      return ResponseManager.sendSuccess(res, leadData, 201, 'Lead created successfully');
    } catch (err) {
      ConsoleManager.error(`Error creating lead: ${err.message}`);
      return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error creating lead: ${err.message}`);
    }
  });

// Get all leads
router.get('/getAllLeads', async (req, res) => {
  try {
    const { page = 1, limit = 20, leadNo } = req.query;

    // Build the query object based on leadNo if provided
    const query = {};
    if (leadNo) {
      query.leadNo = leadNo;
    }

    // Fetch the leads with pagination and filtering
    const leads = await LeadService.getAllLeads(query, page, limit);

    // Fetch the total number of leads matching the query
    const totalLeads = await LeadService.getNumberOfLeads(query);
    const totalPages = Math.ceil(totalLeads / limit);

    if (!leads || leads.length === 0) {
      return ResponseManager.sendSuccess(res, [], 200, 'No leads found');
    }

    ConsoleManager.log(`Leads fetched: ${JSON.stringify(leads)}`);
    return ResponseManager.sendSuccess(res, {
      leads,
      totalPages,
      currentPage: parseInt(page, 10),
      totalLeads,
    }, 200, 'Leads fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching leads: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching leads: ${err.message}`);
  }
});


// Get a lead by ID
router.get('/getLead/:id', async (req, res) => {
  try {
    const lead = await LeadService.getLeadById(req.params.id);
    if (!lead) {
      return ResponseManager.sendSuccess(res, [], 200, 'Lead not found');
    }
    ConsoleManager.log(`Lead fetched: ${JSON.stringify(lead)}`);
    return ResponseManager.sendSuccess(res, lead, 200, 'Lead fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching lead: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching lead: ${err.message}`);
  }
});

// Update a lead by ID
router.put('/updateLead/:id', async (req, res) => {
  try {
    const { name, phoneNo, email, message, propertyNo } = req.body;

    // Validate required fields
    if (!name) return ResponseManager.handleBadRequestError(res, 'Name is required');
    if (!phoneNo || phoneNo.length !== 10) return ResponseManager.handleBadRequestError(res, 'Valid phone number is required');
    if (!propertyNo) return ResponseManager.handleBadRequestError(res, 'Property Number is required');

    // Update the lead
    const updatedLead = await LeadService.updateLead(req.params.id, { name, phoneNo, email, message, propertyNo });

    if (!updatedLead) {
      return ResponseManager.sendSuccess(res, [], 200, 'Lead not found');
    }

    ConsoleManager.log(`Lead updated: ${JSON.stringify(updatedLead)}`);
    return ResponseManager.sendSuccess(res, updatedLead, 200, 'Lead updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating lead: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating lead: ${err.message}`);
  }
});

// Update lead status by ID
router.put('/removeLead/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Active', 'Disabled',].includes(status)) {
      return ResponseManager.handleBadRequestError(res, 'Valid status is required');
    }

    const updatedLead = await LeadService.updateLeadStatus(req.params.id, status);

    if (!updatedLead) {
      return ResponseManager.sendSuccess(res, [], 200, 'Lead not found');
    }

    ConsoleManager.log(`Lead status updated: ${JSON.stringify(updatedLead)}`);
    return ResponseManager.sendSuccess(res, updatedLead, 200, 'Lead status updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating lead status: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating lead status: ${err.message}`);
  }
});

// Delete a lead by ID
router.delete('/deleteLead/:id', async (req, res) => {
  try {
    const deletedLead = await LeadService.deleteLead(req.params.id);

    if (!deletedLead) {
      return ResponseManager.sendSuccess(res, [], 200, 'Lead not found');
    }

    ConsoleManager.log(`Lead deleted: ${JSON.stringify(deletedLead)}`);
    return ResponseManager.sendSuccess(res, [], 200, 'Lead deleted successfully');
  } catch (err) {
    ConsoleManager.error(`Error deleting lead: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error deleting lead: ${err.message}`);
  }
});

module.exports = router;
