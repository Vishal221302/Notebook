import { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import * as api from '../utils/api';

export default function AdminLanguages({ languages, onUpdate }) {
  const [newLang, setNewLang] = useState({ name: '', slug: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newLang.name || !newLang.slug) return;
    try {
      await api.addLanguage(newLang);
      setNewLang({ name: '', slug: '' });
      onUpdate();
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this language and all its topics?")) {
      try {
        await api.deleteLanguage(id);
        onUpdate();
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight"><span className="text-gradient">Manage Library</span></h1>
          <p className="text-slate-500 font-medium">Add, remove, or edit the languages used to categorize your notes.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-900/5 border border-orange-50 overflow-hidden transition-all duration-500">
        <form onSubmit={handleAdd} className="p-8 border-b border-orange-50 bg-orange-50/20 flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
            <input
              type="text"
              placeholder="e.g. JavaScript"
              className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold placeholder:font-medium placeholder:text-slate-300"
              value={newLang.name}
              onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identifier (Slug)</label>
            <input
              type="text"
              placeholder="e.g. javascript"
              className="w-full h-14 px-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold placeholder:font-medium placeholder:text-slate-300"
              value={newLang.slug}
              onChange={(e) => setNewLang({ ...newLang, slug: e.target.value })}
            />
          </div>
          <div className="flex sm:items-end">
            <button type="submit" className="h-14 px-8 bg-gradient-premium text-white font-bold rounded-2xl flex items-center gap-2 hover:opacity-90 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]">
              <Plus className="w-5 h-5" /> Create
            </button>
          </div>
        </form>

        <div className="divide-y divide-orange-50">
          {languages.map(lang => (
            <div key={lang.id} className="p-6 flex items-center justify-between hover:bg-orange-50/30 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-orange-50 flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 group-hover:bg-gradient-premium group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">{lang.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Route ID:</span>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{lang.slug}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(lang.id)}
                className="w-12 h-12 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                title="Delete Language"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
          {languages.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center space-y-4">
              <Globe className="w-16 h-16 text-slate-100" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No categories found in your library.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
