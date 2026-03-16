const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/Note');
const { processNoteWithAI } = require('./controllers/aiController');

const app = express();

// 1. FIXED CORS (Removed trailing slash and added options handler)
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://cogninote-ai-git-main-akanshas-projects-76a6fd7b.vercel.app" // REMOVED THE "/" AT THE END
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Handle pre-flight for Express v5+
app.options("/*", cors());

app.use(express.json());

// 2. Add a simple root route so the Render link doesn't show an error
app.get("/", (req, res) => {
    res.send("CogniNote AI Backend is Running!");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// API Route to Create Note
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

// API Route to Get All Notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route to Delete Note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. FIXED: Only ONE declaration of PORT allowed
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
