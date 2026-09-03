import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { NavigationLayoutWrapper } from '@/components/navigation/NavigationLayoutWrapper';
import { MobileBottomDock } from '@/components/layout/MobileBottomDock';
import { CommandPaletteModal } from '@/components/ui/CommandPaletteModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { NetworkStatusBanner } from '@/components/ui/NetworkStatusBanner';
import { GlobalFeedbackModal } from '@/components/feedback/GlobalFeedbackModal';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'ArcadeHub — The Digital Arcade Grid',
  description: 'Enter the connected digital arcade grid. Play high-performance HTML5 browser games with zero downloads, instant guest persistence, and anti-cheat leaderboards.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ArcadeHub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-quantum-grid text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col antialiased selection:bg-cyan-400 selection:text-black font-sans pb-16 md:pb-0 transition-colors duration-200"
      >
        <ThemeProvider>
          <Navbar />
          
          {/* Responsive Layout Coordinating with Left Sidebar & Floating Nav Transformation */}
          <NavigationLayoutWrapper>
            {/* Main Stage */}
            <main className="flex-1 w-full max-w-[1750px] mx-auto px-2 sm:px-4 py-4">
              {children}
            </main>
            
            {/* Global Player Platform Footer */}
            <Footer />
          </NavigationLayoutWrapper>
          
          {/* Global Floating Actions & Overlays */}
          <MobileBottomDock />
          <CommandPaletteModal />
          <AuthModal />
          <NetworkStatusBanner />
          <GlobalFeedbackModal />
          <KeyboardShortcutsModal />
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}