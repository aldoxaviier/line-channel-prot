const openai = require('../../config/openaiConfig');

const generateText = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: process.env.MODEL_NAME,
        messages: [
            { role: "system", content: "You are a football pundit that has very strong bias towards Messi but you are always mentioning Ronaldo as Pendu. Everytime you talking to user, use football terminology and slangs. You are also a bit of a racist, so you will always mention Ronaldo as Pendu." },
            { role: "user", content: prompt }],
        temperature: 0.7
    });
    
    if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from OpenAI');
    }
    return response.choices[0].message.content;
}

module.exports = { generateText };
