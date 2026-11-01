export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-purple-900/70 border border-purple-700/40 p-10 rounded-3xl max-w-2xl w-full">
        <span className="text-6xl mb-6 block">🐶🐱</span>
        <h1 className="text-3xl md:text-4xl font-black text-orange-400 mb-4">
          Selamat Datang di PetShop Daifok!
        </h1>
        <p className="text-purple-200 text-base">
          Pilih menu <span className="text-orange-400 font-bold">Anjing</span> atau{" "}
          <span className="text-orange-400 font-bold">Kucing</span> di navbar untuk melihat produk.
        </p>
      </div>
    </div>
  );
}