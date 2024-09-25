const dotenv = require('dotenv');
const propertyManager = require('../services/properties/prop_services'); 
const ConsoleManager = require('./consoleManager'); 

dotenv.config();

async function generatePropertyNo() {
    try {
        // Fetch the number of properties (or another suitable metric for generating the number)
        const numberOfProperties = await propertyManager.getNumberOfProperties();

        const PropertyNoPrefix = process.env.PROPERTY_PREFIX || 'prop'; 
        const PROPERTY_NO = `${PropertyNoPrefix}${numberOfProperties + 1}`;

        ConsoleManager.log(`Generated property number: ${PROPERTY_NO}`);

        return PROPERTY_NO;
    } catch (error) {
        ConsoleManager.error(`Error generating property number: ${error.message}`);
        throw new Error("Failed to generate property number");
    }
}

module.exports = { generatePropertyNo };
