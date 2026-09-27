import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { AppProvider } from '@/context/AppContext';
import { CSVImportModal } from '@/components/modals/CSVImportModal';
import { NewRequisitionModal } from '@/components/modals/NewRequisitionModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Áp Lực Kế - B2B Recruitment Analytics & Funnel Diagnostics',
  description:
    'Áp Lực Kế (Pressure Gauge) is an intelligent HR funnel analytics platform that diagnoses pipeline bottlenecks and candidate drop-offs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body
        className="bg-[var(--background)] text-[var(--foreground)] h-screen overflow-hidden flex font-sans antialiased"
        suppressHydrationWarning
      >
        <AppProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-16 lg:pb-0">
            <Header />
            <main className="flex-1 overflow-hidden flex flex-col bg-[var(--background)]">
              {children}
            </main>
          </div>
          <BottomNav />
          <CSVImportModal />
          <NewRequisitionModal />
        </AppProvider>
      </body>
    </html>
  );
}
