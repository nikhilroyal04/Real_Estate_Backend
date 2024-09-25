const express = require('express');
const router = express.Router();
const ContactService = require('../../services/contact/contact_services');
const ResponseManager = require('../../utils/responseManager');

// Create a new contact
router.post('/createContact', async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Manual validation
    if (!name || name.trim() === '') {
      return ResponseManager.sendError(res, 400, 'VALIDATION_ERROR', 'Name is required');
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      return ResponseManager.sendError(res, 400, 'VALIDATION_ERROR', 'Phone Number is required');
    }

    const contact = await ContactService.createContact(req.body);
    ResponseManager.sendSuccess(res, contact, 201, 'Contact created successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error creating contact: ${err.message}`);
  }
});

// Get all contacts with pagination and search by phone number
router.get('/getAllContacts', async (req, res) => {
  const { page = 1, limit = 10, phoneNumber = '' } = req.query;
  try {
    const contacts = await ContactService.getAllContacts({ page, limit, phoneNumber });
    if (contacts.length === 0) {
      return ResponseManager.sendSuccess(res, [], 200, 'No contacts found');
    }
    ResponseManager.sendSuccess(res, contacts, 200, 'Contacts retrieved successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching contacts: ${err.message}`);
  }
});

// Get a contact by ID
router.get('/getContact/:id', async (req, res) => {
  try {
    const contact = await ContactService.getContactById(req.params.id);
    if (!contact) {
      return ResponseManager.sendSuccess(res, [], 200, 'Contact not found');
    }
    ResponseManager.sendSuccess(res, contact, 200, 'Contact retrieved successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching contact: ${err.message}`);
  }
});

// Update a contact by ID
router.put('/updateContact/:id', async (req, res) => {
  try {
    const contact = await ContactService.updateContact(req.params.id, req.body);
    if (!contact) {
      return ResponseManager.sendSuccess(res, [], 200, 'Contact not found for update');
    }
    ResponseManager.sendSuccess(res, contact, 200, 'Contact updated successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating contact: ${err.message}`);
  }
});

// Toggle a contact's status by ID
router.put('/removeContact/:id', async (req, res) => {
  const { status, statusReason } = req.body;
  try {
    // Manual validation
    if (!status || !['Connected', 'notConnected', 'Other'].includes(status)) {
      return ResponseManager.sendError(res, 400, 'VALIDATION_ERROR', 'Valid status is required');
    }

    if (status === 'Other' && (!statusReason || statusReason.trim() === '')) {
      return ResponseManager.sendError(res, 400, 'VALIDATION_ERROR', 'Status reason is required when status is "Other"');
    }

    const contact = await ContactService.toggleContactStatus(req.params.id, status, statusReason);
    if (!contact) {
      return ResponseManager.sendSuccess(res, [], 200, 'Contact not found for status toggle');
    }
    ResponseManager.sendSuccess(res, contact, 200, 'Contact status updated successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error toggling contact status: ${err.message}`);
  }
});

// Delete a contact by ID
router.delete('/deleteContact/:id', async (req, res) => {
  try {
    const contact = await ContactService.deleteContact(req.params.id);
    if (!contact) {
      return ResponseManager.sendSuccess(res, [], 200, 'Contact not found for deletion');
    }
    ResponseManager.sendSuccess(res, contact, 200, 'Contact deleted successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error deleting contact: ${err.message}`);
  }
});

// Get the number of contacts
router.get('/count', async (req, res) => {
  try {
    const count = await ContactService.getNumberOfContacts();
    if (count === 0) {
      return ResponseManager.sendSuccess(res, [], 200, 'No contacts found');
    }
    ResponseManager.sendSuccess(res, { count }, 200, 'Contact count retrieved successfully');
  } catch (err) {
    ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error counting contacts: ${err.message}`);
  }
});

module.exports = router;
