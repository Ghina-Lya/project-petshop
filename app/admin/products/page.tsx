import { db } from '@/app/lib/db';
import Link from 'next/link';

export default async function AdminProductsPage() {
  let products: any = [];
  try {
    const [rows]: any = await db.query("SELECT p.*, c.name as categoryName FROM Product p LEFT JOIN Category c ON p.categoryId = c.id ORDER BY p.id DESC");
    products = rows;
  } catch (error) {
    console.error("Gagal memuat produk:", error);
  }

  return (
    <div className="min-h-screen bg-purple-950 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-400">🐾 Dashboard Admin - Kelola Produk</h1>
          <Link href="/home" className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-xl text-xs font-semibold transition">
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-purple-900/60 border border-purple-800 rounded-2xl p-6 shadow-xl backdrop-blur-md overflow-x-auto">
          <h2 className="text-sm font-bold mb-4 text-purple-200">Daftar Produk di Database</h2>
          
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-purple-800 text-purple-300">
                <th className="p-3">ID</th>
                <th className="p-3">Nama Produk</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Stok</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p: any) => (
                  <tr key={p.id} className="border-b border-purple-800/50 hover:bg-purple-800/30">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3">{p.categoryName || '-'}</td>
                    <td className="p-3">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                    <td className="p-3">{p.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-purple-400">Belum ada produk tersedia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}