const openai = require('../../config/openaiConfig');

const generateText = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: process.env.MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    });
    if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from OpenAI');
    }
    return response.choices[0].message.content;
}

module.exports = { generateText };
