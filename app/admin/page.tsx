"use client";

import { useState, useEffect } from "react";
import { getTopCategories, createProduct } from "../lib/actions";
import Link from "next/link";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const catData = await getTopCategories();
      setCategories(catData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("categoryId", categoryId);
      formData.append("imageUrl", imageUrl);
      formData.append("description", description);

      await createProduct(formData);
      setSuccess("Produk berhasil ditambahkan!");
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setImageUrl("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Gagal menambah produk");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">🛠️ Admin Dashboard</h1>
          <p className="text-purple-300 text-sm">Tambah produk baru ke PetShop Daifok</p>
        </div>
        <Link href="/home" className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
          Kembali ke Home
        </Link>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-xl text-sm">⚠️ {error}</div>}
      {success && <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded-xl text-sm">✨ {success}</div>}

      {/* Form Tambah Produk */}
      <div className="bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-orange-400">Tambah Produk Baru</h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-purple-300 mb-1">Nama Produk</label>
            <input
              type="text"
              placeholder="Contoh: Royal Canin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-purple-300 mb-1">Harga (Rp)</label>
            <input
              type="number"
              placeholder="Contoh: 50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-purple-300 mb-1">Stok</label>
            <input
              type="number"
              placeholder="Contoh: 20"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-purple-300 mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((parent: any) =>
                parent.children?.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {parent.name} › {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-purple-300 mb-1">URL Gambar (Opsional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-purple-300 mb-1">Deskripsi Produk</label>
            <textarea
              placeholder="Deskripsi produk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-lg"
          >
            Simpan Produk
          </button>
        </form>
      </div>
    </div>
  );
}