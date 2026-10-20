'use client';

import type { Metadata } from "next";
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#130f26] text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
        {/* Tampilkan Navbar hanya jika bukan halaman Login/Register */}
        {!isAuthPage && <Navbar />}

        {/* Main Content Wrapper */}
        <main className="grow max-w-7xl w-full mx-auto p-6 md:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-purple-950 border-t border-purple-900/50 text-center py-6 text-xs text-purple-400">
          <p>© 2026 PetShop daifok. Dibuat dengan penuh kasih sayang untuk hewan peliharaan. 🐾</p>
        </footer>
      </body>
    </html>
  );
}