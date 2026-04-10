import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Save, X, ArrowLeft, BookOpen, Clock, Tag, Sparkles, Layout, TextIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import * as api from '../utils/api';

export default function AddEditTopic({ topics = [], languages = [], onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language_id: location.state?.languageId || ''
  });
  const [loading, setLoading] = useState(isEditing);

  const modules = {
    syntax: true,
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  useEffect(() => {
    const loadTopic = async () => {
      if (isEditing) {
        // Try finding in props first
        let topic = topics.find(t => String(t.id) === String(id));
        
        // If not in props (maybe fresh page load), fetch from API
        if (!topic) {
          try {
            const res = await api.getTopicById(id);
            topic = res.data;
          } catch (error) {
            console.error("Error fetching topic for edit:", error);
          }
        }

        if (topic) {
          setFormData({ 
            title: topic.title, 
            content: topic.content, 
            language_id: topic.language_id || '' 
          });
        }
        setLoading(false);
      }
    };

    loadTopic();
  }, [id, isEditing, topics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.language_id) {
        alert("Please fill all fields including language.");
        return;
    }
    
    if (isEditing) {
      onSave(id, formData);
    } else {
      onSave(formData);
    }
    
    // Smart navigation
    if (window.location.pathname.startsWith('/admin')) {
      navigate('/admin');
    } else {
      navigate(formData.language_id ? `/language/${formData.language_id}` : '/');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full space-y-10 pb-20 px-4"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-orange-100">
        <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-[0.2em] mb-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </button>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight flex items-center gap-4">
              {isEditing ? <Sparkles className="w-10 h-10 text-orange-500" /> : <Layout className="w-10 h-10 text-orange-500" />}
              {isEditing ? 'Update Notes' : 'New Study Topic'}
            </h1>
            <p className="text-slate-500 font-medium max-w-sm">
                Organize your thoughts and structure your learning materials efficiently.
            </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="relative grid gap-8 group">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-premium rounded-full hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                 <Tag className="w-4 h-4 text-orange-400" /> Topic Title
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="title"
                  placeholder="e.g. Advanced JavaScript Performance"
                  className="input w-full text-lg font-bold h-16 bg-white border-2 border-slate-100 hover:border-orange-200 focus:border-orange-500 focus:ring-8 focus:ring-orange-50 transition-all px-6 rounded-2xl placeholder:font-medium placeholder:text-slate-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                 <Globe className="w-4 h-4 text-orange-400" /> Select Language
              </label>
              <div className="relative group">
                <select
                  className="input w-full text-lg font-bold h-16 bg-white border-2 border-slate-100 hover:border-orange-200 focus:border-orange-500 focus:ring-8 focus:ring-orange-50 transition-all px-6 rounded-2xl appearance-none"
                  value={formData.language_id}
                  onChange={(e) => setFormData({ ...formData, language_id: e.target.value })}
                  required
                >
                  <option value="">Select a language</option>
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowLeft className="w-5 h-5 rotate-[270deg]" />
                </div>
              </div>
            </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <TextIcon className="w-4 h-4 text-orange-400" /> Content & Detailed Notes
              </label>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Auto-saving enabled
              </div>
          </div>
          <div className="relative group quill-editor-wrapper">
             <ReactQuill 
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={modules}
                placeholder="Start writing your detailed notes here. You can even paste images!"
                className="bg-white rounded-[24px] overflow-hidden border-2 border-slate-100 hover:border-orange-200 transition-all font-medium"
              />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button type="submit" className="btn btn-primary h-16 px-12 text-lg rounded-2xl shadow-xl shadow-orange-200 flex-1 sm:flex-none">
            <Save className="w-5 h-5" /> {isEditing ? 'Save Changes' : 'Create Topic'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="btn btn-secondary h-16 px-10 text-lg rounded-2xl flex-1 sm:flex-none"
          >
            <X className="w-5 h-5" /> Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
