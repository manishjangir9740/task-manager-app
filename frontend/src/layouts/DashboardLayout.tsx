import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, LogOut, User as UserIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Global Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Workspace Tagline */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">TaskManager</h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Workspace Dashboard</span>
            </div>
          </div>

          {/* User Profile Info & Actions */}
          <div className="flex items-center gap-3">
            
            {/* User Chip */}
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100/50 rounded-full py-1.5 px-3.5 select-none">
              <div className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-indigo-950 capitalize">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={logout}
              className="flex items-center gap-2 border border-rose-100 bg-rose-50/50 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-semibold text-sm rounded-xl py-1.5 px-4 transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-rose-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
