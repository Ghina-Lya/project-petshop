import { getProducts, getTopCategories } from "@/app/lib/actions";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  children: Category[];
};

type Product = {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  category: {
    name: string;
    parent: { name: string } | null;
  };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ProductCatalog({ categoryId }: { categoryId?: number }) {
  const [productsResult, topCategoriesResult] = await Promise.all([
    getProducts(categoryId),
    getTopCategories(),
  ]);
  const products = productsResult as Product[];
  const topCategories = topCategoriesResult as Category[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">Katalog Produk</h1>

      {/* Filter Kategori Navbar Style */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            !categoryId ? "bg-orange-500 text-white shadow" : "bg-purple-900 border border-purple-700 text-purple-200 hover:bg-purple-800"
          }`}
        >
          Semua Produk
        </Link>
        {topCategories.map((top) =>
          top.children?.map((sub) => (
            <Link
              key={sub.id}
              href={`/?kategori=${sub.id}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                categoryId === sub.id
                  ? "bg-orange-500 text-white shadow"
                  : "bg-purple-900 border border-purple-700 text-purple-200 hover:bg-purple-800"
              }`}
            >
              {top.name} - {sub.name}
            </Link>
          ))
        )}
      </div>

      {/* Grid Produk */}
      {products.length === 0 ? (
        <p className="text-center text-purple-300 py-12">Belum ada produk untuk kategori ini.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-purple-900/60 backdrop-blur rounded-xl shadow-lg border border-purple-800 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-48 bg-purple-950 flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition duration-300" />
                  ) : (
                    <span className="text-4xl">🐾</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-orange-400 mb-1 uppercase tracking-wider">
                    {p.category.parent?.name} › {p.category.name}
                  </p>
                  <h3 className="font-bold text-base text-white line-clamp-2">{p.name}</h3>
                </div>
              </div>
              <div className="p-4 pt-0 flex justify-between items-center mt-2">
                <span className="font-extrabold text-orange-400 text-lg">{formatPrice(p.price)}</span>
                <span className="text-xs bg-purple-950 px-2.5 py-1 rounded-md text-purple-300 border border-purple-800">Stok: {p.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}