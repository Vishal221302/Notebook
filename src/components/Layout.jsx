import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Navbar';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils/lib';

export default function Layout({ children, topics, languages, isAdmin, user, onLogout, onReorderTopics }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar for desktop */}
      <Sidebar topics={topics} languages={languages} isAdmin={isAdmin} className="hidden lg:flex" onReorderTopics={onReorderTopics} />

      {/* Mobile sidebar overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <Sidebar topics={topics} languages={languages} isAdmin={isAdmin} onClose={() => setIsSidebarOpen(false)} onReorderTopics={onReorderTopics} className="relative w-72 h-full shadow-2xl" />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} user={user} onLogout={onLogout} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
