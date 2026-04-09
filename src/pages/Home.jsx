import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Calendar, MoreVertical, Trash2, Edit2, Grid, List as ListIcon, Plus, Search } from 'lucide-react';
import { cn } from '../utils/lib';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import { useEffect } from 'react';

export default function Home({ topics, onDelete }) {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    (t.content && t.content.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    hljs.highlightAll();
  }, [filteredTopics]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl"><span className="text-gradient">Admin Dashboard</span></h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage all study topics and notes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest hidden sm:block">Total Topics: {filteredTopics.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group flex-1 max-w-lg">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Filter by title or content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 h-14 text-base bg-white/50 backdrop-blur-sm border-slate-200 hover:border-orange-200 focus:bg-white w-full focus:ring-orange-400/10"
          />
        </div>
        <NavLink to="/admin/add" className="btn btn-primary h-14 px-8 text-lg rounded-xl shadow-lg shadow-orange-200">
            <Plus className="w-5 h-5" /> Add New
        </NavLink>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredTopics.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-orange-100 rounded-3xl bg-orange-50/20"
          >
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-orange-100 flex items-center justify-center text-orange-400 mb-6 group hover:scale-110 transition-transform">
               <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No topics found</h3>
            <p className="text-slate-500 max-w-xs mb-8">Ready to start a new learning journey? Create your first study note topic.</p>
            <NavLink to="/admin/add" className="btn btn-primary h-12 px-8 text-lg rounded-xl">
              <Plus className="w-5 h-5" /> Create New Topic
            </NavLink>
          </motion.div>
        ) : (
          <div className="space-y-8 w-full">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group/card animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-black tracking-tight leading-tight">
                        <span className="mr-3">{index + 1}.</span>{topic.title}
                      </h3>
                      <div className="flex gap-2">
                        <NavLink to={`/admin/edit/${topic.id}`} title="Edit" className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                          <Edit2 className="w-5 h-5" />
                        </NavLink>
                        <button onClick={() => onDelete(topic.id)} title="Delete" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pl-0 sm:pl-8">
                      <NavLink to={`/admin/topic/${topic.id}`} className="block group/content">
                        <div 
                          className="text-slate-700 text-[20px] leading-relaxed font-normal group-hover/content:text-slate-900 transition-colors ql-editor !p-0"
                          dangerouslySetInnerHTML={{ __html: topic.content }}
                        />
                      </NavLink>
                      
                      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(topic.created_at).toLocaleDateString()}
                        </div>
                        {topic.language_name && (
                          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-orange-100">
                            {topic.language_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
