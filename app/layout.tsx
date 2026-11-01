import "./globals.css";
import { Suspense } from "react";
import AppNavbar from "./components/AppNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#130f26] text-slate-100">
        <Suspense
          fallback={
            <div className="h-14 bg-purple-900 border-b border-purple-800" />
          }
        >
          <AppNavbar />
        </Suspense>

        <main className="flex-1 max-w-6xl w-full mx-auto p-6">{children}</main>

        <footer className="bg-purple-950 border-t border-purple-900 text-center py-4 text-xs text-purple-400">
          © 2026 PetShop Daifok
        </footer>
      </body>
    </html>
  );
}