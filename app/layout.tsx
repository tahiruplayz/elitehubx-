import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: { default: 'EliteHubX – Premium Gaming Hub', template: '%s | EliteHubX' },
  description: 'Discover and download the best PC games. Trending, latest, and low-end PC games all in one place.',
  keywords: ['games', 'download', 'PC games', 'gaming', 'EliteHubX'],
  openGraph: { siteName: 'EliteHubX', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer style={{ textAlign: 'center', padding: '2rem 1rem', marginTop: '4rem', borderTop: '1px solid rgba(124,58,237,0.12)', color: '#334155', fontSize: '0.82rem' }}>
            <p>© 2025 EliteHubX · All game links redirect to official sources · We do not host any game files</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
