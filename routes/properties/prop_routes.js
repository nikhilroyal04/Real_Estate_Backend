const express = require('express');
const multer = require('multer');
const PropertyService = require('../../services/properties/prop_services');
const ConsoleManager = require('../../utils/consoleManager');
const ResponseManager = require('../../utils/responseManager');
const fileUploaderController = require('../../controller/mediaUploader');
const router = express.Router();
const {generatePropertyNo} = require('../../utils/propertyNo');
const CookieManager = require('../../utils/cookieManager');  


// Configure multer for multiple image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new property
router.post('/addProperty', upload.array('media', 10), async (req, res) => {
  try {
    // Manually check for required fields
    const { 
      location, address, projectName, subLocation, reraNo, reraApproved, 
      property, propertyFor, propertyType, propertySubtype, facility, connectivity, 
      offeredCost, currentCost, documents, usp, loanApplicable, 
      registeredNo, paymentOptions, size, returnRY, status, 
      createdBy, createdOn, updatedOn 
    } = req.body;

    if (!location) return ResponseManager.handleBadRequestError(res, 'Location is required');
    if (!address) return ResponseManager.handleBadRequestError(res, 'Address is required');
    if (!projectName) return ResponseManager.handleBadRequestError(res, 'Project Name is required');
    if (!subLocation) return ResponseManager.handleBadRequestError(res, 'Sub-Location is required');
    if (!reraNo) return ResponseManager.handleBadRequestError(res, 'RERA Number is required');
    if (!reraApproved) return ResponseManager.handleBadRequestError(res, 'RERA Approved is required');
    if (!property) return ResponseManager.handleBadRequestError(res, 'Property is required');
    if (!propertyFor) return ResponseManager.handleBadRequestError(res, 'Property For is required');
    if (!propertyType) return ResponseManager.handleBadRequestError(res, 'Property Type is required');
    if (!propertySubtype) return ResponseManager.handleBadRequestError(res, 'Property Subtype is required');
    if (!facility) return ResponseManager.handleBadRequestError(res, 'Facility is required');
    if (!connectivity) return ResponseManager.handleBadRequestError(res, 'Connectivity is required');
    if (!offeredCost) return ResponseManager.handleBadRequestError(res, 'Offered Cost is required');
    if (!currentCost) return ResponseManager.handleBadRequestError(res, 'Current Cost is required');
    if (!documents) return ResponseManager.handleBadRequestError(res, 'Documents are required');
    if (!usp) return ResponseManager.handleBadRequestError(res, 'USP is required');
    if (!loanApplicable) return ResponseManager.handleBadRequestError(res, 'Loan Applicable is required');
    if (!registeredNo) return ResponseManager.handleBadRequestError(res, 'Registered Number is required');
    if (!paymentOptions) return ResponseManager.handleBadRequestError(res, 'Payment Options are required');
    if (!size) return ResponseManager.handleBadRequestError(res, 'Size is required');
    if (!returnRY) return ResponseManager.handleBadRequestError(res, 'Return (RY) is required');
    if (!status) return ResponseManager.handleBadRequestError(res, 'Status is required');
    if (!createdBy) return ResponseManager.handleBadRequestError(res, 'Created By is required');
    if (!createdOn) return ResponseManager.handleBadRequestError(res, 'Created On is required');
    if (!updatedOn) return ResponseManager.handleBadRequestError(res, 'Updated On is required');

    // Generate property number
    const propertyNo = await generatePropertyNo();

    // Process images
    const mediaFiles = req.files;
    const mediaUrls = [];

    for (const file of mediaFiles) {
      try {
        const imageUrl = await fileUploaderController.uploadMedia(file.buffer);
        mediaUrls.push(imageUrl);
      } catch (error) {
        return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Failed to upload image: ${error}`);
      }
    }

    // Create a new property
    const propertyData = await PropertyService.createProperty({
      propertyNo, // Add the generated property number
      location, address, projectName, subLocation, reraNo, reraApproved, 
      property, propertyFor, propertyType, propertySubtype, facility, connectivity, 
      offeredCost, currentCost, documents, usp, media: mediaUrls, 
      loanApplicable, registeredNo, paymentOptions, size, returnRY, 
      status, createdBy, createdOn, updatedOn 
    });

    ConsoleManager.log(`Property created: ${JSON.stringify(propertyData)}`);
    return ResponseManager.sendSuccess(res, propertyData, 201, 'Property created successfully');
  } catch (err) {
    ConsoleManager.error(`Error creating property: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error creating property: ${err.message}`);
  }
});


// Get all properties
router.get('/getAllProperties', async (req, res) => {
  try {
    let { page = 1, limit = 20, propertyNo, location, subLocation, propertyFor, propertyType, propertySubtype } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch user preferences from cookies if not provided in query
    const preferredLocation = location || CookieManager.getCookie(req, 'preferredLocation');
    const preferredPropertyType = propertyType || CookieManager.getCookie(req, 'preferredPropertyType');
    const preferredPropertyFor = propertyFor || CookieManager.getCookie(req, 'preferredPropertyFor');

    // If filters not provided, use preferred values from cookies
    location = location || preferredLocation;
    propertyType = propertyType || preferredPropertyType;
    propertyFor = propertyFor || preferredPropertyFor;

    // Build the query object based on the filters
    const query = {};
    if (propertyNo) {
      query.propertyNo = { $regex: new RegExp(propertyNo, 'i') }; 
    }
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') }; 
    }
    if (subLocation) {
      query.subLocation = { $regex: new RegExp(subLocation, 'i') }; 
    }
    if (propertyFor) {
      query.propertyFor = { $regex: new RegExp(propertyFor, 'i') }; 
    }
    if (propertyType) {
      query.propertyType = { $regex: new RegExp(propertyType, 'i') }; 
    }
    if (propertySubtype) {
      query.propertySubtype = { $regex: new RegExp(propertySubtype, 'i') };
    }

    const skip = propertyNo || location || subLocation ? 0 : (pageNumber - 1) * limitNumber;

    const properties = await PropertyService.getAllProperties(query, skip, propertyNo || location || subLocation ? 0 : limitNumber);
    const totalProperties = await PropertyService.getTotalCount(query);

    // Calculate the total number of pages (only if not searching)
    const totalPages = propertyNo || location || subLocation ? 1 : Math.ceil(totalProperties / limitNumber);

    if (properties.length === 0) {
      return ResponseManager.sendSuccess(res, {
        properties,
        totalPages,
        currentPage: pageNumber,
        totalProperties,
      }, 200, 'Property not found'); 
    }

    // Store user preferences in cookies if filters are used
    if (location) CookieManager.setCookie(res, 'preferredLocation', location);
    if (propertyType) CookieManager.setCookie(res, 'preferredPropertyType', propertyType);
    if (propertyFor) CookieManager.setCookie(res, 'preferredPropertyFor', propertyFor);

    ConsoleManager.log(`Properties fetched: ${JSON.stringify(properties)}`);

    return ResponseManager.sendSuccess(res, {
      properties,
      totalPages,
      currentPage: pageNumber,
      totalProperties,
    }, 200, 'Properties fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching properties: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching properties: ${err.message}`);
  }
});

// Get a property by ID
router.get('/getProperty/:id', async (req, res) => {
  try {
    const property = await PropertyService.getPropertyById(req.params.id);
    if (!property) {
      return ResponseManager.sendSuccess(res, [], 200, 'Property not found');
    }
    ConsoleManager.log(`Property fetched: ${JSON.stringify(property)}`);
    return ResponseManager.sendSuccess(res, property, 200, 'Property fetched successfully');
  } catch (err) {
    ConsoleManager.error(`Error fetching property: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error fetching property: ${err.message}`);
  }
});

// Update a property by ID
router.put('/updateProperty/:id', upload.array('media', 10), async (req, res) => {
  try {
    // Manually check for required fields
    const { 
      location, address, projectName, subLocation, reraNo, reraApproved, 
      property, propertyFor, propertyType, propertySubtype, facility, connectivity, 
      offeredCost, currentCost, documents, usp, loanApplicable, 
      registeredNo, paymentOptions, size, returnRY, status, 
      createdBy, createdOn, updatedOn 
    } = req.body;

    if (!location) return ResponseManager.handleBadRequestError(res, 'Location is required');
    if (!address) return ResponseManager.handleBadRequestError(res, 'Address is required');
    if (!projectName) return ResponseManager.handleBadRequestError(res, 'Project Name is required');
    if (!subLocation) return ResponseManager.handleBadRequestError(res, 'Sub-Location is required');
    if (!reraNo) return ResponseManager.handleBadRequestError(res, 'RERA Number is required');
    if (!reraApproved) return ResponseManager.handleBadRequestError(res, 'RERA Approved is required');
    if (!property) return ResponseManager.handleBadRequestError(res, 'Property is required');
    if (!propertyType) return ResponseManager.handleBadRequestError(res, 'Property Type is required');
    if (!propertyFor) return ResponseManager.handleBadRequestError(res, 'Property For is required');
    if (!propertySubtype) return ResponseManager.handleBadRequestError(res, 'Property Subtype is required');
    if (!facility) return ResponseManager.handleBadRequestError(res, 'Facility is required');
    if (!connectivity) return ResponseManager.handleBadRequestError(res, 'Connectivity is required');
    if (!offeredCost) return ResponseManager.handleBadRequestError(res, 'Offered Cost is required');
    if (!currentCost) return ResponseManager.handleBadRequestError(res, 'Current Cost is required');
    if (!documents) return ResponseManager.handleBadRequestError(res, 'Documents are required');
    if (!usp) return ResponseManager.handleBadRequestError(res, 'USP is required');
    if (!loanApplicable) return ResponseManager.handleBadRequestError(res, 'Loan Applicable is required');
    if (!registeredNo) return ResponseManager.handleBadRequestError(res, 'Registered Number is required');
    if (!paymentOptions) return ResponseManager.handleBadRequestError(res, 'Payment Options are required');
    if (!size) return ResponseManager.handleBadRequestError(res, 'Size is required');
    if (!returnRY) return ResponseManager.handleBadRequestError(res, 'Return (RY) is required');
    if (!status) return ResponseManager.handleBadRequestError(res, 'Status is required');
    if (!createdBy) return ResponseManager.handleBadRequestError(res, 'Created By is required');
    if (!createdOn) return ResponseManager.handleBadRequestError(res, 'Created On is required');
    if (!updatedOn) return ResponseManager.handleBadRequestError(res, 'Updated On is required');

    // Process images
    const mediaFiles = req.files;
    const mediaUrls = [];

    for (const file of mediaFiles) {
      try {
        const imageUrl = await fileUploaderController.uploadMedia(file.buffer);
        mediaUrls.push(imageUrl);
      } catch (error) {
        return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Failed to upload image: ${error}`);
      }
    }

    // Update the property
    const propertyData = await PropertyService.updateProperty(req.params.id, {
      location, address, projectName, subLocation, reraNo, reraApproved, 
      property, propertyFor, propertyType, propertySubtype, facility, connectivity, 
      offeredCost, currentCost, documents, usp, media: mediaUrls, 
      loanApplicable, registeredNo, paymentOptions, size, returnRY, 
      status, createdBy, createdOn, updatedOn 
    });

    if (!propertyData) {
      return ResponseManager.sendSuccess(res, [], 200, 'Property not found');
    }

    ConsoleManager.log(`Property updated: ${JSON.stringify(propertyData)}`);
    return ResponseManager.sendSuccess(res, propertyData, 200, 'Property updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating property: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating property: ${err.message}`);
  }
});

// Delete a property by ID
router.delete('/deleteProperty/:id', async (req, res) => {
  try {
    const property = await PropertyService.deleteProperty(req.params.id);
    if (!property) {
      return ResponseManager.sendSuccess(res, [], 200, 'Property not found');
    }
    ConsoleManager.log(`Property deleted: ${JSON.stringify(property)}`);
    return ResponseManager.sendSuccess(res, property, 200, 'Property deleted successfully');
  } catch (err) {
    ConsoleManager.error(`Error deleting property: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error deleting property: ${err.message}`);
  }
});

// Update property status by ID
router.put('/removeProperty/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) return ResponseManager.handleBadRequestError(res, 'Status is required');

    const propertyData = await PropertyService.updatePropertyStatus(req.params.id, status);

    if (!propertyData) {
      return ResponseManager.sendSuccess(res, [], 200, 'Property not found');
    }

    ConsoleManager.log(`Property status updated: ${JSON.stringify(propertyData)}`);
    return ResponseManager.sendSuccess(res, propertyData, 200, 'Property status updated successfully');
  } catch (err) {
    ConsoleManager.error(`Error updating property status: ${err.message}`);
    return ResponseManager.sendError(res, 500, 'INTERNAL_ERROR', `Error updating property status: ${err.message}`);
  }
});

module.exports = router;
