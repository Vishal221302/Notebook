import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit2, Trash2, Clock, Share2, Bookmark, Copy, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import * as api from '../utils/api';
import hljs from 'highlight.js';

export default function TopicDetail({ readOnly = false, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  useEffect(() => {
    if (topic) {
      hljs.highlightAll();
    }
  }, [topic]);

  const fetchTopic = async () => {
    try {
        const res = await api.getTopicById(id);
        setTopic(res.data);
    } catch (error) {
        console.error("Error fetching topic:", error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-r-4 border-orange-200"></div>
          <p className="text-slate-400 font-medium animate-pulse">Fetching your notes...</p>
        </div>
      );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center glass-card border-orange-100">
        <div className="w-24 h-24 rounded-3xl bg-red-50 text-red-400 flex items-center justify-center mb-6 shadow-sm">
          <Trash2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Topic not found</h2>
        <p className="text-slate-500 mb-8 max-w-sm font-medium">It might have been deleted or the link is incorrect. Return to the safety of the dashboard.</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary h-14 px-10 rounded-2xl shadow-xl shadow-orange-200">
          Go Back Home
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure?")) {
        onDelete(topic.id);
        navigate('/admin');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(topic.content);
    alert('Notes copied to clipboard!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10 max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn btn-secondary h-12 px-5 pr-8 rounded-2xl hover:bg-white hover:border-orange-200 transition-all font-bold text-slate-600 group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back
        </button>
        {!readOnly && (
            <div className="flex gap-3">
              <NavLink to={`/admin/edit/${topic.id}`} className="btn btn-secondary h-12 px-5 text-orange-600 border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-all font-bold">
                <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Notes</span>
              </NavLink>
              <button onClick={handleDelete} className="btn btn-danger h-12 px-5 font-bold">
                <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
        )}
      </div>

      <header className="space-y-8 animate-in slide-in-from-left duration-700">
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] bg-orange-50 w-fit px-5 py-2.5 rounded-full ring-2 ring-orange-100 shadow-sm">
          <Calendar className="w-4 h-4" />
          <span>Created on {new Date(topic.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.1]">
          {topic.title}
        </h1>
        <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-premium shadow-lg shadow-orange-200 flex items-center justify-center text-white font-black text-lg">
                  {topic.language_name?.[0] || 'V'}
                </div>
                <div>
                   <p className="text-base font-black text-slate-800 tracking-tight">{topic.language_name || 'Knowledge Base'}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Study Session</p>
                </div>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                   <span className="text-sm font-black text-slate-800 block">{Math.ceil(topic.content.length / 500)} min</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Read Time</span>
                </div>
            </div>
        </div>
      </header>

      <div className="relative group">
        <div className="absolute -left-6 top-0 bottom-0 w-2 bg-gradient-premium rounded-full shadow-lg shadow-orange-200 opacity-20 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block" />
        <div className="bg-white rounded-[2.5rem] p-10 lg:p-16 shadow-2xl shadow-orange-900/5 border border-orange-50 leading-[1.8] text-[20px] text-slate-700 min-h-[500px] prose prose-orange max-w-none relative overflow-hidden transition-all duration-500 ql-editor">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-premium opacity-[0.03] blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        </div>
        
        <div className="flex items-center justify-between mt-12 p-8 bg-slate-950 text-white rounded-[2rem] shadow-2xl overflow-hidden relative group/footer">
            <div className="absolute inset-0 bg-gradient-premium opacity-5 group-hover/footer:opacity-20 transition-opacity duration-1000" />
            <div className="flex items-center gap-6 relative z-10">
                <p className="text-base font-bold opacity-70 hidden md:block">Helpful resources?</p>
                <div className="flex gap-3">
                    <button className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all border border-white/10"><ThumbsUp className="w-6 h-6" /></button>
                    <button className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all border border-white/10"><Bookmark className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="flex gap-3 items-center relative z-10">
                 <button onClick={copyToClipboard} className="btn h-14 px-8 bg-white text-slate-950 hover:bg-orange-50 font-black rounded-2xl shadow-xl transition-all border-none active:scale-[0.98]">
                    <Copy className="w-5 h-5" /> <span className="hidden sm:inline">Copy Notes</span>
                 </button>
                 <button className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"><Share2 className="w-6 h-6" /></button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
