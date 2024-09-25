const dotenv = require('dotenv');
const LeadService = require('../services/leads/lead_services'); 
const ConsoleManager = require('./consoleManager');

dotenv.config();

async function generateLeadNo() {
    try {
        const numberOfLeads = await LeadService.getNumberOfLeads();

        const LeadNoPrefix = process.env.LEAD_PREFIX || 'lead'; 
        const LEAD_NO = `${LeadNoPrefix}${numberOfLeads + 1}`;

        ConsoleManager.log(`Generated lead number: ${LEAD_NO}`);

        return LEAD_NO;
    } catch (error) {
        ConsoleManager.error(`Error generating lead number: ${error.message}`);
        throw new Error("Failed to generate lead number");
    }
}

module.exports = { generateLeadNo };
