import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, LogIn, AlertCircle, Train, Fingerprint } from 'lucide-react';

const Login = () => {
  const [rail_id, setRailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(rail_id, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600 shadow-lg shadow-primary-500/50" />
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-2">
            <Train size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">Login with your User ID to access RailConnect services.</p>
        </div>

        {error && (
          <div role="alert" className="p-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-900/50 text-sm font-black animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">User ID</label>
            <div className="relative group">
              <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Enter your User ID"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                value={rail_id}
                onChange={(e) => setRailId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-700 transform transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary-500/30 mt-8"
          >
            {loading ? 'Logging in...' : (
              <>
                Login <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-2">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
