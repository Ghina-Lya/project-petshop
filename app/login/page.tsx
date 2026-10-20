'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '../lib/actions';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await loginUser(formData);
    } catch (err: any) {
      if (err.message?.includes('NEXT_REDIRECT') || err.digest?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError(err.message || 'Terjadi kesalahan saat masuk.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex items-center justify-center px-4 sm:px-6 py-8 font-sans text-white">
      <div className="bg-purple-900/80 border border-purple-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <Link href="/home" className="text-lg sm:text-xl tracking-widest font-bold uppercase text-orange-400 hover:text-orange-300 transition">
            🐾 PetShop Daifok
          </Link>
          <h1 className="text-xs sm:text-sm tracking-wider font-semibold text-purple-200">Masuk ke Akun Anda</h1>
        </div>

        {error && <div className="bg-red-950/90 border border-red-800 text-red-300 text-xs p-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-purple-200 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 rounded-xl border border-purple-700 bg-purple-950 text-white outline-none focus:border-orange-400 transition"
              placeholder="ex@email.com"
            />
          </div>

          <div>
            <label className="font-semibold text-purple-200 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className="w-full p-3 pr-10 rounded-xl border border-purple-700 bg-purple-950 text-white outline-none focus:border-orange-400 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white text-sm focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl tracking-widest font-bold uppercase transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs text-purple-300">
          Belum punya akun?{' '}
          <Link href="/register" className="font-bold text-orange-400 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}