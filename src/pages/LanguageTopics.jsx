import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import * as api from '../utils/api';
import hljs from 'highlight.js';

export default function LanguageTopics({ languages, user }) {
  const { id } = useParams();
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentLanguage = languages.find(l => String(l.id) === String(id));

  useEffect(() => {
    if (id) {
      fetchLanguageTopics();
    } else {
      fetchAllTopics();
    }
  }, [id]);

  useEffect(() => {
    hljs.highlightAll();
  }, [topics]);

  // Scroll to topic if hash exists in URL
  useEffect(() => {
    if (location.hash && !loading) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optional: Add a brief highlight effect
          element.classList.add('ring-4', 'ring-orange-200', 'rounded-3xl', 'transition-all');
          setTimeout(() => element.classList.remove('ring-4', 'ring-orange-200'), 2000);
        }, 100);
      }
    }
  }, [location.hash, loading, topics]);

  const fetchLanguageTopics = async () => {
    setLoading(true);
    try {
      const res = await api.getTopicsByLanguage(id);
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching language topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      const res = await api.getTopics();
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching all topics:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleReorder = async (newTopics) => {
    const originalTopics = [...topics];
    setTopics(newTopics);
    try {
      await api.reorderTopics(newTopics.map(t => t.id));
    } catch (error) {
      console.error("Error reordering topics:", error);
      setTopics(originalTopics);
      alert("Failed to save new order. Please try again.");
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index - 1];
    newTopics[index - 1] = temp;
    handleReorder(newTopics);
  };

  const handleMoveDown = (index) => {
    if (index === topics.length - 1) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index + 1];
    newTopics[index + 1] = temp;
    handleReorder(newTopics);
  };

  return (
    <div className="space-y-8 pb-12 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {currentLanguage ? <span className="text-gradient">{currentLanguage.name}</span> : 'Explore All Topics'}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium">Curated study notes for your learning journey.</p>
        </div>
        <Link
          to="/add-topic"
          state={{ languageId: id }}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Topic
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-r-4 border-orange-200"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading topics...</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-orange-100 shadow-xl shadow-orange-500/5">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-400">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No topics found</h2>
          <p className="text-slate-500 max-w-sm mx-auto">It looks like there aren't any notes here yet. Choose another language or check back later!</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              id={`topic-${topic.id}`}
              className="group animate-in fade-in slide-in-from-bottom-4 duration-700 p-1 scroll-mt-20"
            >
              <div className="space-y-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-tight flex-1">
                    <span className="mr-3">{index + 1}.</span>{topic.title}
                  </h3>
                  {user && (
                    <div className="flex items-center gap-1 sm:gap-2 ml-4">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-2 rounded-xl transition-all ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-black hover:bg-slate-100 active:scale-90'}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4 sm:w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === topics.length - 1}
                        className={`p-2 rounded-xl transition-all ${index === topics.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-black hover:bg-slate-100 active:scale-90'}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4 sm:w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pl-0">
                  <div
                    className="text-slate-700 text-lg sm:text-[20px] leading-relaxed font-normal ql-editor !p-0"
                    dangerouslySetInnerHTML={{ __html: topic.content }}
                  />

                  <div className=" flex flex-wrap items-center gap-4 pt-3 border-t border-slate-50">
                    {topic.language_name && (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-md border border-slate-100">
                        {topic.language_name}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(topic.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
