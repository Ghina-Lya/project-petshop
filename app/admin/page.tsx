"use client";

import { useState, useEffect } from "react";
import { getProducts, getTopCategories, createProduct, deleteProduct } from "../lib/actions";
import Link from "next/link";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
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
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getTopCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data admin");
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
      loadData();
    } catch (err: any) {
      setError(err.message || "Gagal menambah produk");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await deleteProduct(id);
      setSuccess("Produk berhasil dihapus!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus produk");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">🛠️ Admin Dashboard</h1>
          <p className="text-purple-300 text-sm">Kelola produk dan inventaris PetShop Daifok</p>
        </div>
        <Link href="/home" className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold">
          Kembali ke Home
        </Link>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-xl text-sm">⚠️ {error}</div>}
      {success && <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded-xl text-sm">✨ {success}</div>}

      {/* Form Tambah Produk */}
      <div className="bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-orange-400">Tambah Produk Baru</h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
          <input
            type="number"
            placeholder="Harga (Rp)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
          <input
            type="number"
            placeholder="Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
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
          <input
            type="text"
            placeholder="URL Gambar (Opsional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm md:col-span-2"
          />
          <textarea
            placeholder="Deskripsi produk..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
          >
            Simpan Produk
          </button>
        </form>
      </div>

      {/* Daftar Produk */}
      <div className="bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-orange-400">Daftar Produk</h2>
        {loading ? (
          <p className="text-purple-300 text-sm">Memuat data produk...</p>
        ) : products.length === 0 ? (
          <p className="text-purple-300 text-sm">Belum ada produk.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center bg-purple-950 border border-purple-800 p-4 rounded-xl">
                <div>
                  <p className="font-bold text-white text-sm">{p.name}</p>
                  <p className="text-orange-400 text-xs">Rp {Number(p.price).toLocaleString("id-ID")} | Stok: {p.stock}</p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}