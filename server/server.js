const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/Note');
const { processNoteWithAI } = require('./controllers/aiController');

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173", // For local testing
        "cogninote-h0ff0hjj9-akanshas-projects-76a6fd7b.vercel.app" 
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// API Route to Create Note
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // 1. Call Gemini to get AI insights
        const aiData = await processNoteWithAI(content);

        // 2. Save Note with AI data to MongoDB
        const newNote = new Note({
            title,
            content,
            summary: aiData.summary,
            tags: aiData.tags
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route to Get All Notes
app.get('/api/notes', async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
});
app.delete('/api/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
