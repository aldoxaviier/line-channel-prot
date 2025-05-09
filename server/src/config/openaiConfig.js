const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const config = {
    apiKey: process.env.OPENAI_API_KEY,
};

// Only add baseURL if it's specified in environment variables
if (process.env.OPENAI_BASE_URL) {
    config.baseURL = process.env.OPENAI_BASE_URL;
}

const openaiClient = new OpenAI(config);

module.exports = {openaiClient};