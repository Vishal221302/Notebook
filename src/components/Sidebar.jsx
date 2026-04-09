import { NavLink, useLocation, useMatch } from 'react-router-dom';
import { Home, PlusCircle, Search, BookOpen, Settings, Globe, FileText, LogIn, ChevronRight } from 'lucide-react';
import { cn } from '../utils/lib';

export default function Sidebar({ topics = [], languages = [], isAdmin, onClose, className }) {
  const location = useLocation();
  const match = useMatch("/language/:id");
  const viewTopicMatch = useMatch("/view-topic/:id");
  const adminTopicMatch = useMatch("/admin/topic/:id");
  
  let currentLanguageId = match?.params?.id;

  // If viewing a topic, find its language to keep the sidebar menu open
  if (!currentLanguageId) {
    const activeTopicId = viewTopicMatch?.params?.id || adminTopicMatch?.params?.id;
    if (activeTopicId) {
      const activeTopic = topics.find(t => String(t.id) === String(activeTopicId));
      if (activeTopic) {
        currentLanguageId = String(activeTopic.language_id);
      }
    }
  }

  return (
    <aside className={cn("flex flex-col bg-white border-r border-orange-50 w-72 shrink-0 transition-transform duration-300", className)}>
      <div className="h-16 flex items-center px-6 border-b border-orange-50 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white shadow-lg shadow-orange-200 ring-4 ring-orange-50">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">Read<span className="text-orange-600">Topic</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {isAdmin ? (
          <div className="space-y-1">
            <label className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Dashboard</label>
            <NavLink to="/admin" onClick={onClose} end className={({ isActive }) => cn("nav-link text-slate-600 flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100", isActive && "bg-primary-50 text-primary-600")}>
              <Home className="w-4 h-4" /> Dashboard
            </NavLink>
            <NavLink to="/admin/add" onClick={onClose} className={({ isActive }) => cn("nav-link text-slate-600 flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100", isActive && "bg-primary-50 text-primary-600")}>
              <PlusCircle className="w-4 h-4" /> Add Topic
            </NavLink>
            <NavLink to="/admin/languages" onClick={onClose} className={({ isActive }) => cn("nav-link text-slate-600 flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100", isActive && "bg-primary-50 text-primary-600")}>
              <Settings className="w-4 h-4" /> Manage Languages
            </NavLink>
            <button 
              onClick={() => { window.location.href = '/'; localStorage.removeItem('admin_user'); }} 
              className="w-full nav-link text-red-600 flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 mt-4 font-bold"
            >
              <LogIn className="w-4 h-4 rotate-180" /> Logout Admin
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Languages</label>
            <div className="flex flex-col gap-1 mt-2">
              <NavLink to="/" onClick={onClose} end className={({ isActive }) => cn("nav-link text-slate-600 flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100", isActive && "bg-primary-50 text-primary-600")}>
                <Globe className="w-4 h-4" /> All Topics
              </NavLink>
              {languages.map(lang => {
                const isActive = currentLanguageId === String(lang.id);
                const languageTopics = topics.filter(t => String(t.language_id) === String(lang.id));

                return (
                  <div key={lang.id} className="space-y-1">
                    <NavLink 
                      to={`/language/${lang.id}`} 
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "nav-link text-slate-600 flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-all",
                        isActive && "bg-orange-50 text-orange-600 font-bold"
                      )}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{lang.name}</span>
                    </NavLink>

                    {/* Show topics if this language is active */}
                    {isActive && languageTopics.length > 0 && (
                      <div className="pl-6 space-y-1 mt-1 border-l-2 border-orange-100 ml-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        {languageTopics.map(topic => (
                          <NavLink
                            key={topic.id}
                            to={`/language/${lang.id}#topic-${topic.id}`}
                            onClick={(e) => {
                              // If already on this language page, just close sidebar (mobile)
                              // The URL hash change will trigger the scroll effect in LanguageTopics
                              if (onClose) onClose();
                            }}
                            className={({ isActive }) => cn(
                              "flex items-center gap-2 p-2 text-xs rounded-lg transition-all",
                              location.hash === `#topic-${topic.id}`
                                ? "bg-orange-100 text-orange-700 font-bold" 
                                : "text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                            )}
                          >
                            <ChevronRight className={cn("w-3 h-3 shrink-0", location.hash === `#topic-${topic.id}` ? "opacity-100" : "opacity-40")} />
                            <span className="truncate">{topic.title}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="space-y-1">
            <label className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Access</label>
            <div className="flex flex-col gap-1 mt-2 max-h-60 overflow-y-auto">
              {topics.slice(0, 10).map(topic => (
                <NavLink 
                  key={topic.id} 
                  to={`/admin/topic/${topic.id}`} 
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "nav-link text-sm truncate p-2 rounded-lg hover:bg-slate-100 flex items-center gap-2",
                    isActive && "bg-primary-50 text-primary-600"
                  )}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">{topic.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-orange-50 bg-orange-50/30">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
            {isAdmin ? <Settings className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-700 truncate">{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
            <span className="text-xs text-slate-500 font-medium">{isAdmin ? 'Full Access' : 'Read Only'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
