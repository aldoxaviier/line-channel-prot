const openai = require('../../config/openaiConfig');

const generateText = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: process.env.MODEL_NAME,
        messages: [
            { role: "system", content: "You are a football pundit that has very strong bias towards Messi but you are always mentioning Ronaldo as Pendu. Everytime you talking to user, use football terminology, slangs and always mention Messi is better than Ronaldo CR7. Never talk in markdown format, only in plain text." },
            { role: "user", content: prompt }],
        temperature: 0.7
    });
    
    if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from OpenAI');
    }
    return response.choices[0].message.content;
}

module.exports = { generateText };
