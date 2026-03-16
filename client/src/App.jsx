import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Plus, Trash2, Hash, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await axios.post(API_URL, { title, content });
      setTitle(''); setContent('');
      fetchNotes();
    } catch (err) { console.error("Post Error:", err); }
    setLoading(false);
  };

  // NEW: Delete functionality to make it a complete CRUD app
  const deleteNote = async (id) => {
    try {
      // Note: You'll need an app.delete('/api/notes/:id') route in your backend for this
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (err) { console.error("Delete Error:", err); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-700">
      {/* Header */}
    {/* Header */}
<header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
  <div className="flex items-center gap-3">
    <div className="bg-brand/20 p-2 rounded-xl">
      <Sparkles className="text-brand w-8 h-8" />
    </div>
    <div>
      <h1 className="text-3xl font-black tracking-tight text-white">
        CogniNote <span className="text-brand">AI</span>
      </h1>
      <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
        Intelligence Layer v2.0
      </p>
    </div>
  </div>

  <div className="flex items-center gap-6">
    {/* System Status Indicator */}
    <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        AI Systems Nominal
      </span>
    </div>
  </div>
</header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <section className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass p-6 sticky top-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
               <Plus className="w-5 h-5 text-brand" /> New Smart Note
            </h2>
            <input 
              className="w-full bg-slate-800/50 border border-white/10 p-3 rounded-lg mb-4 outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              className="w-full bg-slate-800/50 border border-white/10 p-3 rounded-lg h-40 mb-4 outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all resize-none"
              placeholder="Paste your long thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button 
              disabled={loading}
              className="w-full bg-brand hover:bg-indigo-500 active:scale-95 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is thinking...
                </span>
              ) : (
                <><Zap className="w-4 h-4" /> Save with AI</>
              )}
            </button>
          </form>
        </section>

        {/* Right: Notes Feed */}
        <section className="lg:col-span-2 space-y-6">
          {notes.length === 0 && (
            <div className="text-center py-20 glass border-dashed">
              <p className="text-slate-500 italic">Your AI-powered knowledge base is empty...</p>
            </div>
          )}
          
          {notes.map((note) => (
            <div key={note._id} className="glass p-6 hover:border-brand/40 transition-all group relative overflow-hidden">
              {/* Subtle background glow effect on hover */}
              <div className="absolute -inset-y-full inset-x-0 bg-gradient-to-b from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors">
                  {note.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  {/* Trash button hidden until hover */}
                  <button 
                    onClick={() => deleteNote(note._id)}
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-4 line-clamp-3 relative z-10 leading-relaxed">
                {note.content}
              </p>
              
              {/* IMPACTFUL AI INSIGHTS BOX */}
              <div className="relative overflow-hidden bg-brand/5 border border-brand/10 p-4 rounded-xl mb-4 z-10">
                <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-tighter mb-2">
                  <Sparkles className="w-3 h-3 animate-pulse" /> AI Summary
                </div>
                <p className="text-slate-200 text-sm italic font-medium">
                  "{note.summary}"
                </p>
              </div>

              <div className="flex flex-wrap gap-2 relative z-10">
                {note.tags?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 text-[9px] font-bold bg-slate-800/80 px-2 py-1 rounded text-slate-400 border border-white/5 uppercase tracking-wider">
                    <Hash className="w-2 h-2 text-brand" /> {tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
      {/* Footer */}
<footer className="mt-20 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
  <div className="text-sm">
    &copy; 2026 CogniNote AI. Built with <span className="text-red-500/60">❤️</span> by 
    <span className="text-slate-300 font-semibold ml-1">Akansha</span>
  </div>
  
  <div className="flex items-center gap-6">
    <a 
      href="https://www.linkedin.com/in/akansha-b29a19254/" 
      target="_blank" 
      rel="noreferrer"
      className="text-xs hover:text-brand transition-colors flex items-center gap-1"
    >
      LinkedIn
    </a>
    <a 
      href="https://github.com/Akansha1409" 
      target="_blank" 
      rel="noreferrer"
      className="text-xs hover:text-brand transition-colors flex items-center gap-1"
    >
      GitHub
    </a>
    <div className="h-4 w-[1px] bg-white/10" />
    <span className="text-[10px] bg-white/5 px-2 py-1 rounded">
      MERN + GROQ STACK
    </span>
  </div>
</footer>
    </div>
  );
}

export default App;
