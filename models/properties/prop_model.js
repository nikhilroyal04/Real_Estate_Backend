const mongoose = require("mongoose");

// Define the Property schema
const propertySchema = new mongoose.Schema({
  propertyNo: {
    type: String,
    unique: true,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  projectName: {
    type: String,
    required: false,
  },
  subLocation: {
    type: String,
    required: false,
  },
  reraNo: {
    type: String,
    required: false,
  },
  reraApproved: {
    type: String,
    enum: ["Yes", "No"],
    required: false,
  },
  property: {
    type: String,
    required: false,
  },
  propertyType: {
    type: String,
    enum: ["Commercial", "Residential", "Other"],
    required: false,
  },
  propertyFor: {
    type: String,
    enum: ["Buy", "Rent", "PG/Co-Living, Other"],
    required: false,
  },
  propertySubtype: {
    type: String,
    enum: ["Mall", "High Street Market", "Shop", "Farm House", "Other", "Flat"],
    required: false,
  },
  facility: {
    type: String,
    required: false,
  },
  connectivity: {
    type: String,
    required: false,
  },
  offeredCost: {
    type: String,
    required: false,
  },
  currentCost: {
    type: String,
    required: false,
  },
  documents: {
    type: String,
    required: false,
  },
  usp: {
    type: String,
    required: false,
  },
  media: {
    type: [String],
    required: false,
  },
  loanApplicable: {
    type: String,
    required: false,
  },
  registeredNo: {
    type: String,
    required: false,
  },
  paymentOptions: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  returnRY: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Pending"],
    default: "pending",
    required: false,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdOn: {
    type: String,
    required: false,
  },
  updatedOn: {
    type: String,
    required: false,
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
