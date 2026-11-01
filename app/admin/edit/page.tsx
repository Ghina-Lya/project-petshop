"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct, getCategories } from "@/app/lib/actions";
import Link from "next/link";

function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("id"));

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    async function loadData() {
      try {
        const [product, catData] = await Promise.all([
          getProductById(productId),
          getCategories(),
        ]);

        if (product) {
          setName(product.name || "");
          setPrice(product.price || "");
          setStock(product.stock || "");
          setCategoryId(product.category_id || "");
          setImageUrl(product.image || "");
          setDescription(product.description || "");
        }
        setCategories(catData);
      } catch (err: any) {
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("categoryId", categoryId);
      formData.append("imageUrl", imageUrl);
      formData.append("description", description);

      await updateProduct(productId, formData);
      alert("Produk berhasil diperbarui!");
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate produk");
    }
  };

  if (loading) return <p className="text-center text-orange-400 py-20">Memuat data produk...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl">
        <h1 className="text-2xl font-bold text-orange-400">✏️ Edit Product</h1>
        <Link href="/home" className="text-sm text-purple-300 hover:text-white">
          Kembali
        </Link>
      </div>

      {error && <div className="bg-red-900/50 text-red-200 p-3 rounded-xl text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl space-y-4">
        <div>
          <label className="block text-xs text-purple-300 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-purple-300 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-purple-300 mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-purple-300 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.animal_type} › {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-purple-300 mb-1">Image URL (Opsional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-purple-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-purple-950 border border-purple-800 p-3 rounded-xl text-white text-sm"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-lg"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<p className="text-center text-orange-400 py-20">Memuat...</p>}>
      <EditForm />
    </Suspense>
  );
}