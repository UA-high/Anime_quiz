import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    const res = await handleRegister({ username, email, password });
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to register');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen bg-[#F5F4EF] [background-image:radial-gradient(circle,#ccc_1px,transparent_1px)] [background-size:22px_22px] flex items-center justify-center px-4 font-['Nunito',sans-serif]">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="w-full bg-white border-[2.5px] border-black rounded-2xl shadow-[6px_6px_0px_#111] p-8 relative">
          {/* Decorative corner stars */}
          <div className="absolute -top-4 -right-4 w-8 h-8">
            <svg viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2 L16.5 11 L26 11 L18.5 17 L21 26 L14 21 L7 26 L9.5 17 L2 11 L11.5 11 Z"
                fill="#FDE047"
                stroke="#111"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6">
            <svg viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2 L16.5 11 L26 11 L18.5 17 L21 26 L14 21 L7 26 L9.5 17 L2 11 L11.5 11 Z"
                fill="#C4B5FD"
                stroke="#111"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 inline-flex">
            <div className="w-9 h-9 rounded-lg bg-[#FDE047] border-[2.5px] border-black shadow-[3px_3px_0_#111] flex items-center justify-center text-lg">
              🎌
            </div>
            <span className="font-black text-xl tracking-tight font-['Gabarito',sans-serif]">
              Otaku<span className="text-violet-700">Quiz</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <span className="inline-block bg-[#C4B5FD] border-[2.5px] border-black rounded-md px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wide mb-3 font-['Gabarito',sans-serif]">
              🌟 Join the Community
            </span>
            <h1 className="font-['Gabarito',sans-serif] font-black text-3xl text-black leading-tight tracking-tight">
              Create your{' '}
              <span className="bg-[#FDE047] border-[2.5px] border-black rounded-lg px-2 shadow-[3px_3px_0_#111] inline-block">
                account
              </span>
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-2">
              Start your journey to become the ultimate Anime Master!
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-100 border-[2px] border-black rounded-xl text-red-700 text-sm font-bold shadow-[2px_2px_0_#000]">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5">
            {/* Username field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="font-['Gabarito',sans-serif] font-black text-sm text-black uppercase tracking-wide"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={username}
                placeholder="Choose a cool otaku handle"
                className="border-[2.5px] border-black rounded-xl px-4 py-3 text-sm font-semibold bg-[#F5F4EF] placeholder-gray-400 outline-none focus:shadow-[4px_4px_0_#C4B5FD] focus:border-black transition-shadow duration-150"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-['Gabarito',sans-serif] font-black text-sm text-black uppercase tracking-wide"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                placeholder="Enter your email"
                className="border-[2.5px] border-black rounded-xl px-4 py-3 text-sm font-semibold bg-[#F5F4EF] placeholder-gray-400 outline-none focus:shadow-[4px_4px_0_#C4B5FD] focus:border-black transition-shadow duration-150"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-['Gabarito',sans-serif] font-black text-sm text-black uppercase tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  value={password}
                  placeholder="At least 6 characters"
                  className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm font-semibold bg-[#F5F4EF] placeholder-gray-400 outline-none focus:shadow-[4px_4px_0_#FCA5A5] focus:border-black transition-shadow duration-150 pr-12"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors text-base"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-1 bg-[#FDE047] border-[2.5px] border-black rounded-xl py-3.5 font-['Gabarito',sans-serif] font-black text-base text-black shadow-[4px_4px_0_#111] hover:shadow-[6px_6px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_#111] active:translate-x-0 active:translate-y-0 transition-all duration-150 cursor-pointer"
            >
              ⚡ Create Free Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1.5px] bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-[1.5px] bg-gray-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm font-semibold text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-black text-black underline decoration-[#FDE047] decoration-2 underline-offset-2 hover:text-violet-700 transition-colors"
            >
              Log in instead →
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Register;