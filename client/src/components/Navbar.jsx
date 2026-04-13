import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Train, User, LogOut, Sun, Moon, LayoutDashboard, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabClick = (tabId) => {
    // If we are already on dashboard, just set the tab via custom event or similar
    // For simplicity, we can navigate with state
    navigate('/dashboard', { state: { activeTab: tabId } });
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 no-print sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group shrink-0">
          <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg text-white group-hover:bg-primary-700 transition-colors">
            <Train size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
            RailConnect
          </span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              <button
                onClick={() => handleTabClick('search')}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard size={18} className="sm:w-4 sm:h-4" />
                <span className="hidden lg:inline font-medium text-sm">Dashboard</span>
              </button>
              <button
                onClick={() => handleTabClick('history')}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="History"
              >
                <History size={18} className="sm:w-4 sm:h-4" />
                <span className="hidden lg:inline font-medium text-sm">History</span>
              </button>
              <button
                onClick={() => handleTabClick('profile')}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Profile"
              >
                <User size={18} className="sm:w-4 sm:h-4" />
                <span className="hidden lg:inline font-medium text-sm">Profile</span>
              </button>
              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-wider shrink-0"
                title="Logout"
              >
                <LogOut size={14} />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
