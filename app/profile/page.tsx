import { getSession, logout } from "../lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-purple-900/60 border border-purple-800 rounded-2xl p-6 space-y-5 text-center">
        <div className="text-5xl">👤</div>
        <h1 className="text-xl font-bold text-orange-400">Profil Saya</h1>

        <div className="text-left space-y-3 bg-purple-950/50 rounded-xl p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-300">Username</span>
            <span className="text-white font-semibold">{session.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Email</span>
            <span className="text-white font-semibold">{session.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Role</span>
            <span className={session.role === "admin" ? "text-orange-400 font-semibold" : "text-green-400 font-semibold"}>
              {session.role}
            </span>
          </div>
        </div>

        {session.role === "admin" && (
          <Link
            href="/admin/products"
            className="block w-full bg-purple-700 hover:bg-purple-600 py-2.5 rounded-xl text-sm font-semibold"
          >
            Kelola Produk
          </Link>
        )}

        <form action={logout}>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-xl text-sm font-bold"
          >
            Logout
          </button>
        </form>

        <Link href="/home" className="text-xs text-purple-400 hover:text-white">
          ← Kembali
        </Link>
      </div>
    </div>
  );
}