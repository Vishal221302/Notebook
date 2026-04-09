import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, User } from 'lucide-react';
import * as api from '../utils/api';

export default function Login({ onLogin, user }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.data.success) {
        onLogin(res.data.user);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-orange-50 animate-in zoom-in duration-500">
        <div className="bg-gradient-premium p-10 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-xl border border-white/30">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="opacity-90 text-sm mt-2 font-medium">Elevate your learning management</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@readtopic.com"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-premium hover:opacity-90 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Authorized Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
