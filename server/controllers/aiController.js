const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const processNoteWithAI = async (text) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes notes and provides hashtags. You must return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Analyze this note: "${text}". 
                    Provide a 1-sentence summary and 3 relevant hashtags. 
                    Format: {"summary": "...", "tags": ["#tag1", "#tag2", "#tag3"]}`
                }
            ],
            model: "llama-3.1-8b-instant", // Fastest free-tier model in 2026
            response_format: { type: "json_object" } // Forces JSON output
        });

        // Parse and return the content
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq AI Error:", error.message);
        // Fallback if the API fails
        return { 
            summary: "Summary is being generated...", 
            tags: ["#Note", "#AI"] 
        };
    }
};

module.exports = { processNoteWithAI };