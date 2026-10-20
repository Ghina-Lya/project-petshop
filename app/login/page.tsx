'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '../lib/actions';

export default function LoginPage() {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      await loginUser(formData);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex items-center justify-center px-4 font-sans text-white">
      <div className="bg-purple-900/80 border border-purple-800 p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link href="/home" className="text-xl tracking-widest font-bold uppercase text-orange-400">
            🐾 PetShop Daifok
          </Link>
          <h1 className="text-sm tracking-wider font-semibold text-purple-200">Masuk ke Akun Anda</h1>
        </div>

        {error && <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-purple-200">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 p-3 rounded-xl border border-purple-700 bg-purple-950 text-white outline-none focus:border-orange-400"
              placeholder="ex@email.com"
            />
          </div>

          <div>
            <label className="font-semibold text-purple-200">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-1 p-3 rounded-xl border border-purple-700 bg-purple-950 text-white outline-none focus:border-orange-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl tracking-widest font-bold uppercase transition shadow-sm"
          >
            Masuk
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