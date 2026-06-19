import React from 'react';
import { Layers, Check } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f5f7fa]">
      {/* Left Column: Visual Brand Banner */}
      <div className="w-full md:w-1/2 bg-gradient-to-tr from-indigo-700 via-[#7c3aed] to-blue-500 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden select-none">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskManager</span>
        </div>

        {/* Brand Pitch & Key Value Propositions */}
        <div className="my-auto py-12 md:py-0 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6 max-w-md">
            Get things done, <br />
            <span className="text-blue-100">one task at a time.</span>
          </h1>
          <p className="text-white/80 text-base lg:text-lg mb-10 max-w-md leading-relaxed">
            Organize your work across Todo, In Progress, and Done — a clean board that keeps you focused on what matters.
          </p>

          {/* Features Checklist */}
          <div className="flex flex-wrap gap-3 max-w-md">
            <div className="flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-2 rounded-full backdrop-blur-md">
              <Check className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium">Visual kanban board</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-2 rounded-full backdrop-blur-md">
              <Check className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium">Priority tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-2 rounded-full backdrop-blur-md">
              <Check className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium">Instant updates</span>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-white/60 text-xs tracking-wider uppercase font-semibold relative z-10">
          Your tasks. Your pace. Your board.
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
