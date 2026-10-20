"use client";

import { useState, useEffect } from "react";
import { addProduct, deleteProduct, getProducts, getTopCategories } from "../lib/actions";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pData = await getProducts();
        const cData = await getTopCategories();
        setProducts(pData);
        setCategories(cData);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-orange-400 font-semibold text-lg">Memuat data produk...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-400">Admin - Kelola Produk</h1>
      </div>

      {/* Form Tambah Produk */}
      <div className="bg-purple-900/80 border border-purple-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Tambah Produk Baru</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Nama Produk</label>
            <input type="text" name="name" required className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Harga (IDR)</label>
            <input type="number" name="price" required className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Stok</label>
            <input type="number" name="stock" required defaultValue={10} className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Subkategori</label>
            <select name="categoryId" required className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white">
              {categories.map((cat: any) =>
                cat.children?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {cat.name} › {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-purple-200 mb-1">URL Gambar (Cloudinary Link)</label>
            <input type="url" name="imageUrl" placeholder="https://res.cloudinary.com/..." className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-purple-200 mb-1">Deskripsi</label>
            <textarea name="description" rows={2} className="w-full px-3 py-2 bg-purple-950 border border-purple-700 rounded-lg text-sm text-white" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg text-sm shadow transition">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Daftar Produk */}
      <div className="bg-purple-900/80 border border-purple-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-purple-950 text-orange-400 border-b border-purple-800">
              <th className="p-3">Nama</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-purple-800/50 hover:bg-purple-800/30">
                <td className="p-3 font-medium text-white">{p.name}</td>
                <td className="p-3 text-purple-300">{p.category?.parent?.name} › {p.category?.name}</td>
                <td className="p-3 text-orange-400">Rp {p.price?.toLocaleString()}</td>
                <td className="p-3 text-purple-200">{p.stock}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 hover:text-red-300 text-xs bg-red-950/60 border border-red-800 px-2.5 py-1 rounded transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}