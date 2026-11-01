import Link from "next/link";
import { getSession } from "../lib/actions";

export default async function AppNavbar() {
  const session = await getSession();

  return (
    <header className="bg-purple-900 border-b border-purple-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex justify-between items-center text-sm text-white">
        <Link href="/home" className="font-bold text-orange-400 text-lg">
          🐾 PetShop Daifok
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/home" className="hover:text-orange-400">
            Home
          </Link>
          <Link href="/kategori?type=dog" className="hover:text-orange-400">
            Anjing
          </Link>
          <Link href="/kategori?type=cat" className="hover:text-orange-400">
            Kucing
          </Link>

          {session?.role === "admin" && (
            <Link href="/admin" className="hover:text-orange-400 font-semibold">
              Admin
            </Link>
          )}

          <Link href="/cart" className="text-xl hover:scale-110 transition" title="Keranjang">
            🛒
          </Link>

          {session ? (
            <Link href="/profile" className="text-xl hover:scale-110 transition" title="Profile">
              👤
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg font-semibold"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}