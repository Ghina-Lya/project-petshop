'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-purple-900/95 backdrop-blur-md border-b border-purple-800/60 sticky top-0 z-50 shadow-lg shadow-purple-950/40">
      <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center text-white font-sans">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🐾</span>
          <span className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">
            PetShop daifok
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium">
          <Link href="/home" className="hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Link href="/kategori?type=dog" className="hover:text-orange-400 transition-colors">
            🐶 Anjing
          </Link>
          <Link href="/kategori?type=cat" className="hover:text-orange-400 transition-colors">
            🐱 Kucing
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 bg-purple-800/80 hover:bg-purple-700 px-3.5 py-2 rounded-xl transition-all text-orange-300 font-semibold border border-purple-700/50 shadow-sm">
            <span>🛒</span>
            <span>Keranjang</span>
          </Link>
          <Link 
            href="/login" 
            className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Login / Register
          </Link>
        </nav>
      </div>
    </header>
  );
}