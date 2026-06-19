import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* Header Tabs (Matches App Design) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full mb-8 select-none border border-slate-200/20">
        <button className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl bg-white text-indigo-650 shadow-sm border border-slate-100 cursor-default">
          Sign In
        </button>
        <Link 
          to="/register" 
          className="flex-1 text-center py-2.5 text-xs font-semibold rounded-xl text-slate-505 hover:text-slate-700 transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-8 select-none">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-normal">
          Enter your credentials to access your account.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <span className="font-medium text-xs">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium text-xs">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 outline-none text-slate-800 text-sm placeholder:text-slate-300 transition-all focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 pr-12 outline-none text-slate-800 text-sm placeholder:text-slate-300 transition-all focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Remember / Forgot row */}
        <div className="flex items-center justify-between select-none">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-650"
            />
            <span className="text-xs font-semibold text-slate-500">Remember me</span>
          </label>
          <Link 
            to="/forgot-password" 
            className="text-xs font-bold text-indigo-650 hover:text-indigo-750 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

      </form>

      {/* Register Redirect footer */}
      <div className="mt-8 text-center select-none">
        <span className="text-xs text-slate-400 font-semibold">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-indigo-600 hover:text-indigo-750 font-bold transition-colors"
          >
            Register now
          </Link>
        </span>
      </div>

    </div>
  );
};
