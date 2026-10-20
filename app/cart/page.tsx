'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('petshop_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const toggleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu produk untuk di-checkout!');
      return;
    }

    // Hapus produk yang dicentang dari keranjang
    const remainingItems = cartItems.filter((item) => !selectedItems.includes(item.id));
    setCartItems(remainingItems);
    localStorage.setItem('petshop_cart', JSON.stringify(remainingItems));
    setSelectedItems([]);
    setShowSuccessPopup(true);
  };

  return (
    <div className="min-h-[75vh] py-8 space-y-6 relative font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-400">🛒 Keranjang Belanja Anda</h1>
          <Link href="/home" className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-xl text-xs font-semibold transition">
            Lanjut Belanja
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="bg-purple-950/60 border border-purple-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-purple-900/40 p-4 rounded-2xl border border-purple-800/50">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer rounded"
                  />
                  <div className="w-16 h-16 bg-purple-950 rounded-xl overflow-hidden flex items-center justify-center border border-purple-700/50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>🐾</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{item.name}</h3>
                    <p className="text-xs text-orange-400 font-semibold mt-1">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center border-t border-purple-800">
              <span className="text-xs text-purple-300">Total dipilih: {selectedItems.length} produk</span>
              <button
                onClick={handleCheckout}
                className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-orange-500/20"
              >
                Checkout Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-purple-900/20 rounded-3xl border border-purple-800/40 space-y-4">
            <span className="text-5xl block">🛒</span>
            <p className="text-purple-300 text-sm">Keranjang kamu masih kosong 🐾</p>
            <Link href="/home" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition">
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>

      {/* Pop-up Notifikasi Berhasil Checkout */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-purple-900 border border-purple-700 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="text-4xl">🎉</div>
            <h3 className="text-lg font-bold text-orange-400">Checkout Berhasil!</h3>
            <p className="text-xs text-purple-200">Pesanan kamu sedang diproses. Terima kasih sudah berbelanja di PetShop Daifok!</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}