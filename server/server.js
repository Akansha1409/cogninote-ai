const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/Note');
const { processNoteWithAI } = require('./controllers/aiController');

const app = express();

// 1. Clean Middleware-based CORS
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://cogninote-ai-git-main-akanshas-projects-76a6fd7b.vercel.app"
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// 2. Direct Middleware for Pre-flight (Avoids the PathError)
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("CogniNote AI Backend is Live!");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// Routes
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const aiData = await processNoteWithAI(content);
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

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
