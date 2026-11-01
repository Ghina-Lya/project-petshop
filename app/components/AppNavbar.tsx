"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();

  // Sembunyikan navbar jika di halaman login atau register
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-purple-900 border-b border-purple-800 px-6 py-4 flex justify-between items-center text-white">
      <Link href="/home" className="font-extrabold text-lg text-orange-400">
        🐾 PetShop Daifok
      </Link>
      <div className="flex gap-6 items-center text-sm font-semibold">
        <Link href="/home" className="hover:text-orange-400">Home</Link>
        <Link href="/kategori?type=dog" className="hover:text-orange-400">Anjing</Link>
        <Link href="/kategori?type=cat" className="hover:text-orange-400">Kucing</Link>
        <Link href="/cart" className="hover:text-orange-400">🛒 Keranjang</Link>
        <Link href="/login" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-white">
          Login
        </Link>
      </div>
    </nav>
  );
}