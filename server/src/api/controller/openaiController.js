const openaiService = require('../service/openaiService');

const generateText = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        const text = await openaiService.generateText(prompt);
        

        return text;
    } catch (error) {
        console.error('Error generating text:', error);
        throw error;
    }
};


module.exports = { generateText };