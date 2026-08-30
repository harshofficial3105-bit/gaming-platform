import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'ArcadeHub — Free HTML5 Browser Games',
  description: 'Play high-performance, instant HTML5 browser games on desktop and mobile with zero downloads and zero friction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black font-sans"
      >
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/50 py-8 text-center text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} ArcadeHub. Built for high-speed instant browser gaming.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
