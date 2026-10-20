import { getProducts, getTopCategories } from "../lib/actions";
import Link from "next/link";
import { Suspense } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

async function CategoryContent({ searchParams }: { searchParams: Promise<{ type?: string; sub?: string }> }) {
  const params = await searchParams;
  const typeFilter = params.type || 'dog'; // 'dog' atau 'cat'
  const subFilter = params.sub ? Number(params.sub) : undefined;

  const [products, categories]: [any, any] = await Promise.all([
    getProducts(subFilter),
    getTopCategories()
  ]);

  // Cari parent kategori berdasarkan tipe (Anjing / Kucing)
  const currentParent = categories.find((c: any) => c.slug === typeFilter || c.type === typeFilter);

  // Filter produk berdasarkan subkategori atau tipe induknya
  const filteredProducts = products.filter((p: any) => {
    if (subFilter) return p.categoryId === subFilter;
    if (typeFilter) {
      return p.category?.parent?.slug === typeFilter || 
             p.category?.slug?.includes(typeFilter) || 
             p.category?.type === typeFilter;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & Filter Subkategori */}
      <div className="bg-purple-900/40 border border-purple-700/30 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white capitalize flex items-center gap-3">
              <span>{typeFilter === 'dog' ? '🐶' : '🐱'}</span>
              Katalog {typeFilter === 'dog' ? 'Anjing' : 'Kucing'}
            </h1>
            <p className="text-purple-300 text-sm mt-1">Pilih kategori atau subkategori produk di bawah ini:</p>
          </div>
        </div>
        
        {/* Tombol Pilihan Subkategori */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/kategori?type=${typeFilter}`}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              !subFilter 
                ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30" 
                : "bg-purple-950/60 border border-purple-700/40 text-purple-200 hover:bg-purple-800/50"
            }`}
          >
            Semua {typeFilter === 'dog' ? 'Anjing' : 'Kucing'}
          </Link>
          
          {currentParent?.children?.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/kategori?type=${typeFilter}&sub=${sub.id}`}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                subFilter === sub.id
                  ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30"
                  : "bg-purple-950/60 border border-purple-700/40 text-purple-200 hover:bg-purple-800/50"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="bg-purple-900/20 border border-purple-800/40 rounded-3xl p-12 text-center">
          <span className="text-5xl mb-3 block">📦</span>
          <p className="text-purple-300 font-medium text-lg">Belum ada produk untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p: any) => (
            <div key={p.id} className="bg-purple-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-purple-700/30 overflow-hidden flex flex-col justify-between group hover:border-orange-500/50 transition-all duration-300">
              <div>
                <div className="h-52 bg-purple-950/80 flex items-center justify-center overflow-hidden relative">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <span className="text-5xl">🐾</span>
                  )}
                  <span className="absolute top-3 right-3 bg-purple-950/80 backdrop-blur-md border border-purple-600/40 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
                    Stok: {p.stock}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-orange-400 mb-1.5 uppercase tracking-wider">
                    {p.category?.parent?.name} › {p.category?.name}
                  </p>
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-300 transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-purple-300/80 text-xs mt-2 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex justify-between items-center mt-4">
                <span className="font-black text-orange-400 text-xl">{formatPrice(p.price)}</span>
                <button className="bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-bold px-4 py-2 rounded-xl transition-all">
                  Beli Produk
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KategoriPage({ searchParams }: { searchParams: Promise<{ type?: string; sub?: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-16 text-orange-400 font-semibold text-lg">Memuat data produk dari database...</div>}>
      <CategoryContent searchParams={searchParams} />
    </Suspense>
  );
}