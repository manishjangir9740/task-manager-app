import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login', {
        state: {
          message: 'Account created successfully! Please sign in with your email and password.'
        }
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* Header Tabs (Matches App Design) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full mb-8 select-none border border-slate-200/20">
        <Link 
          to="/login" 
          className="flex-1 text-center py-2.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
        >
          Sign In
        </Link>
        <button className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl bg-white text-indigo-650 shadow-sm border border-slate-100 cursor-default">
          Register
        </button>
      </div>

      {/* Heading */}
      <div className="mb-8 select-none">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          Create your account
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-normal">
          Get started — it takes less than a minute.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium text-xs">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full name input */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 outline-none text-slate-800 text-sm placeholder:text-slate-300 transition-all focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Email input */}
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

        {/* Password input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between select-none">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Password
            </label>
            <span className="text-[9px] font-medium text-slate-400">
              Minimum 6 characters.
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Choose a strong password"
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

        {/* Confirm Password input */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 pr-12 outline-none text-slate-800 text-sm placeholder:text-slate-300 transition-all focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Terms agreement checkbox */}
        <div className="flex items-center justify-between select-none pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer accent-indigo-650"
            />
            <span className="text-[11px] font-medium text-slate-400 leading-tight">
              I agree to the{' '}
              <a href="#" className="text-indigo-650 hover:text-indigo-750 font-bold">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-indigo-650 hover:text-indigo-750 font-bold">Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>+ Create Account</span>
          )}
        </button>

      </form>

    </div>
  );
};
