const Contact = require('../../models/contact/contact_model');
const consoleManager = require('../../utils/consoleManager');

// Create a new contact
const createContact = async (contactData) => {
  try {
    // Manual validation
    if (!contactData.name || contactData.name.trim() === '') {
      throw new Error('Name is required');
    }
    if (!contactData.phoneNumber || contactData.phoneNumber.trim() === '') {
      throw new Error('Phone Number is required');
    }

    const newContact = new Contact(contactData);
    return await newContact.save();
  } catch (error) {
    throw new Error(`Error creating contact: ${error.message}`);
  }
};

// Update a contact by ID
const updateContact = async (id, contactData) => {
  try {
    // No mandatory fields for update
    return await Contact.findByIdAndUpdate(id, contactData, { new: true });
  } catch (error) {
    throw new Error(`Error updating contact: ${error.message}`);
  }
};

// Toggle contact status by ID
const toggleContactStatus = async (id, status, statusReason) => {
  try {
    // Manual validation
    const validStatuses = ['Connected', 'notConnected', 'Other'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status value');
    }

    if (status === 'Other' && (!statusReason || statusReason.trim() === '')) {
      throw new Error('Status reason is required when status is "Other"');
    }

    const updateData = {
      status,
      updatedOn: Date.now()
    };

    if (status === 'Other') {
      updateData.statusReason = statusReason;
    }

    return await Contact.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error toggling contact status: ${error.message}`);
  }
};

// Get all contacts with pagination and search by phone number
const getAllContacts = async ({ page = 1, limit = 10, phoneNumber = '' }) => {
    try {
      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Calculate total count of contacts matching the phone number
      const totalContacts = await Contact.countDocuments({
        phoneNumber: new RegExp(phoneNumber, 'i') 
      });
  
      // Calculate total pages
      const totalPages = Math.ceil(totalContacts / limitNumber);
  
      // Fetch contacts for the current page
      const contacts = await Contact.find({
        phoneNumber: new RegExp(phoneNumber, 'i') 
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
      return {
        contacts,
        totalPages,
        currentPage: pageNumber
      };
    } catch (err) {
      throw new Error(`Error fetching contacts: ${err.message}`);
    }
  };

// Get a contact by ID
const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw new Error(`Error fetching contact by ID: ${error.message}`);
  }
};

// Delete a contact by ID
const deleteContact = async (id) => {
  try {
    return await Contact.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting contact: ${error.message}`);
  }
};

// Get the number of contacts
const getNumberOfContacts = async () => {
  try {
    return await Contact.countDocuments();
  } catch (error) {
    throw new Error(`Error counting contacts: ${error.message}`);
  }
};

module.exports = {
  createContact,
  updateContact,
  toggleContactStatus,
  getAllContacts,
  getContactById,
  deleteContact,
  getNumberOfContacts
};
