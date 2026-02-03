import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as standard premium font
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickleball Team Cup",
  description: "Friendly Team Competition Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-slate-50 relative")}>
        {/* Festive Background Pattern (Optional subtle texture) */}

        <nav className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50 border-b-4 border-yellow-500">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" className="opacity-30" />
                <path d="M2 12a14.5 14.5 0 0 0 20 0 14.5 14.5 0 0 0-20 0" className="opacity-30" />
                <circle cx="12" cy="12" r="2" fill="currentColor" className="text-yellow-300" />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" className="text-yellow-300" />
                <circle cx="12" cy="17" r="1.5" fill="currentColor" className="text-yellow-300" />
                <circle cx="7" cy="12" r="1.5" fill="currentColor" className="text-yellow-300" />
                <circle cx="17" cy="12" r="1.5" fill="currentColor" className="text-yellow-300" />
              </svg>
              <span className="font-black text-yellow-300">TJCC CNY Cup</span>
            </Link>
            <div className="flex gap-4 text-sm font-bold opacity-90">
              <Link href="/" className="hover:text-yellow-200 transition-colors">Matches</Link>
              <Link href="/login" className="hover:text-yellow-200 transition-colors">Login</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 max-w-md md:max-w-2xl lg:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
