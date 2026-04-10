import { Menu, Search, Plus, Bell, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ onOpenSidebar, user, onLogout }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar} 
          className="lg:hidden p-2 text-slate-500 hover:bg-orange-50 rounded-lg active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <span className="text-sm font-bold">RT</span>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Read<span className="text-orange-600">Topic</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex group relative items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 transition-colors group-focus-within:text-orange-500" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="input w-64 lg:w-96 pl-10 h-10 text-sm focus:w-80 lg:focus:w-[480px] transition-all border-slate-200 focus:border-orange-400 focus:ring-orange-400/10"
          />
        </div>
        
        <NavLink to={user ? "/admin/add" : "/add-topic"} className="btn btn-primary h-10 px-4 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Topic</span>
        </NavLink>

        
        <button className="p-2 text-slate-500 hover:bg-orange-50 rounded-lg relative transition-all group">
          <Bell className="w-5 h-5 group-hover:text-orange-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-premium rounded-full border-2 border-white" />
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-200 shadow-sm">
              AD
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
