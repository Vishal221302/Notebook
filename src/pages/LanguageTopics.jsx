import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import * as api from '../utils/api';
import hljs from 'highlight.js';

export default function LanguageTopics({ languages }) {
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

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {currentLanguage ? <span className="text-gradient">{currentLanguage.name}</span> : 'Explore All Topics'}
        </h1>
        <p className="text-slate-500 text-lg font-medium">Curated study notes for your learning journey.</p>
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
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-tight">
                  <span className="mr-3">{index + 1}.</span>{topic.title}
                </h3>
                
                <div className="pl-0 sm:pl-8">
                  <div 
                    className="text-slate-700 text-[20px] leading-relaxed font-normal ql-editor !p-0"
                    dangerouslySetInnerHTML={{ __html: topic.content }}
                  />
                  
                  {topic.language_name && (
                    <div className="mt-4 pt-2 border-t border-slate-50">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-orange-100">
                        {topic.language_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
