"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { checkout } from "../lib/actions";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("petshop_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Pilih minimal satu produk!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = selectedItems.map((id) => {
        const item = cartItems.find((i) => i.id === id);
        return { productId: id, qty: item?.qty || 1 };
      });

      await checkout(payload);

      const remaining = cartItems.filter((i) => !selectedItems.includes(i.id));
      setCartItems(remaining);
      localStorage.setItem("petshop_cart", JSON.stringify(remaining));
      setSelectedItems([]);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || "Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-400">🛒 Keranjang</h1>
        <Link href="/home" className="text-sm text-purple-300 hover:text-white">
          Lanjut belanja
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 text-sm p-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-16 text-purple-300 space-y-3 bg-purple-900/20 border border-purple-800/50 rounded-2xl">
          <p className="text-lg">Keranjang Anda masih kosong 🛍️</p>
          <p className="text-xs text-purple-400">
            (Belum ada produk yang tersimpan di localStorage `petshop_cart`)
          </p>
          <div className="pt-2">
            <Link
              href="/kategori?type=dog"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition"
            >
              Mulai Belanja Sekarang
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-purple-300">
            Centang produk di bawah ini yang ingin Anda checkout:
          </p>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-purple-900/50 border border-purple-800 p-4 rounded-xl"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{item.name}</p>
                <p className="text-orange-400 text-xs">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}

          {/* Tombol Checkout */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-3 rounded-xl font-bold text-white transition shadow-lg mt-4"
          >
            {loading ? "Memproses..." : "Checkout Sekarang"}
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-purple-900 border border-purple-700 p-6 rounded-2xl text-center space-y-3 max-w-sm mx-4">
            <p className="text-3xl">🎉</p>
            <h3 className="font-bold text-orange-400 text-lg">Checkout Berhasil!</h3>
            <p className="text-xs text-purple-200">Pesanan telah dicatat dan stok produk sudah dikurangi.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-xl text-sm font-bold text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}