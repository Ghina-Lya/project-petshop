"use client";

import { getProducts, getTopCategories, deleteProduct, getSession } from "../lib/actions";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function CategoryContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") || "dog";
  const subFilterParam = searchParams.get("sub");
  const subFilter = subFilterParam ? Number(subFilterParam) : undefined;

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [prodData, catData, currentSession] = await Promise.all([
        getProducts(subFilter),
        getTopCategories(),
        getSession(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setSession(currentSession);
      setLoading(false);
    }
    fetchData();
  }, [subFilter]);

  const currentParent = categories.find(
    (c: any) => c.slug === typeFilter || c.type === typeFilter
  );

  const uniqueProducts = Array.from(
    new Map(products.map((p: any) => [p.id, p])).values()
  );

  const filteredProducts = uniqueProducts.filter((p: any) => {
    if (subFilter) return Number(p.categoryId) === Number(subFilter);
    const animal = p.category?.type;
    if (typeFilter === "dog") return animal === "anjing";
    if (typeFilter === "cat") return animal === "kucing";
    return true;
  });

  const addToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem("petshop_cart") || "[]");
    if (existingCart.find((item: any) => item.id === product.id)) {
      alert(`Produk "${product.name}" sudah ada di keranjang.`);
      return;
    }
    existingCart.push({ ...product, qty: 1 });
    localStorage.setItem("petshop_cart", JSON.stringify(existingCart));
    alert(`"${product.name}" masuk keranjang 🛒`);
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    try {
      await deleteProduct(id);
      alert("Produk berhasil dihapus!");
      const prodData = await getProducts(subFilter);
      setProducts(prodData);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus produk");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-purple-900/40 border border-purple-700/30 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
            <span>{typeFilter === "dog" ? "🐶" : "🐱"}</span>
            Katalog {typeFilter === "dog" ? "Anjing" : "Kucing"}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/kategori?type=${typeFilter}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                !subFilter
                  ? "bg-orange-500 text-white"
                  : "bg-purple-950 border border-purple-700 text-purple-200"
              }`}
            >
              Semua {typeFilter === "dog" ? "Anjing" : "Kucing"}
            </Link>
            {currentParent?.children?.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/kategori?type=${typeFilter}&sub=${sub.id}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  subFilter === sub.id
                    ? "bg-orange-500 text-white"
                    : "bg-purple-950 border border-purple-700 text-purple-200"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>

        {session?.role === "admin" && (
          <Link
            href="/admin"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            ➕ Tambah Produk
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center text-orange-400 py-16">Memuat produk...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-purple-300 py-16">Belum ada produk.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              className="bg-purple-900/40 border border-purple-700/30 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-purple-950 flex items-center justify-center relative">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl">🐾</span>
                )}
                <span className="absolute top-3 right-3 bg-purple-950/80 text-xs px-2 py-1 rounded-full text-white">
                  Stok: {p.stock}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-orange-400 font-bold uppercase">
                  {p.category?.parent?.name} › {p.category?.name}
                </p>
                <h3 className="font-bold text-white mt-1">{p.name}</h3>
                <p className="text-purple-300 text-xs mt-1 line-clamp-2">{p.description}</p>
                
                <div className="mt-auto pt-4 space-y-2">
                  <span className="font-black text-orange-400 text-lg block">
                    {formatPrice(p.price)}
                  </span>

                  {session?.role === "admin" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {/* DIARAHKAN KE HALAMAN EDIT MENGGUNAKAN QUERY PARAMETER ID */}
                      <Link
                        href={`/admin/edit?id=${p.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl text-center transition flex items-center justify-center"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
                    >
                      🛒 + Keranjang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KategoriPage() {
  return (
    <Suspense fallback={<p className="text-center text-orange-400 py-20">Memuat...</p>}>
      <CategoryContent />
    </Suspense>
  );
}