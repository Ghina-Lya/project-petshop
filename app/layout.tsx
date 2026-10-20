import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PetShop daifok",
  description: "Aplikasi Petshop Fullstack Next.js & Aiven MySQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#130f26] text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
        {/* Navbar Estetik Ungu & Oranye */}
        <header className="bg-purple-900/90 backdrop-blur-md border-b border-purple-800/60 sticky top-0 z-50 shadow-lg shadow-purple-950/40">
          <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-2xl transition-transform group-hover:scale-110">🐾</span>
              <span className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">
                PetShop daifok
              </span>
            </Link>

            {/* Menu Navigasi */}
            <nav className="flex items-center gap-8 text-sm font-medium">
              <Link href="/home" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
              <Link href="/kategori?type=dog" className="hover:text-orange-400 transition-colors">
                🐶 Anjing
              </Link>
              <Link href="/kategori?type=cat" className="hover:text-orange-400 transition-colors">
                🐱 Kucing
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