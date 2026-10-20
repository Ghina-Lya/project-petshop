export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 font-sans">
      <div className="bg-linear-to-b from-purple-900/70 to-purple-950/90 border border-purple-700/40 p-10 md:p-14 rounded-3xl shadow-2xl max-w-3xl w-full backdrop-blur-xl">
        <span className="text-6xl mb-6 block animate-bounce">🐶🐱</span>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-amber-300 to-orange-500 mb-4">
          Selamat Datang di PetShop daifok!
        </h1>
        <p className="text-purple-200/90 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
          Pusat kebutuhan hewan peliharaan terpercaya. Selamat berbelanja makanan, mainan, dan grooming terbaik untuk peliharaan kesayangan Anda! Silakan pilih menu kategori <span className="text-orange-400 font-bold">Anjing</span> atau <span className="text-orange-400 font-bold">Kucing</span> di bagian atas untuk melihat produk.
        </p>
      </div>
    </div>
  );
}