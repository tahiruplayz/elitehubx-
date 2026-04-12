import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'EliteHubX – Free PC Games Download | Low End PC Supported',
    template: '%s | EliteHubX',
  },
  description: 'Download free PC games for low-end and high-end PCs. Find trending, popular and new PC games with direct download links. Best gaming hub for low spec PCs.',
  keywords: ['free pc games download', 'low end pc games', 'pc games free', 'download pc games', 'games for 2gb ram', 'games for 4gb ram', 'EliteHubX'],
  openGraph: { siteName: 'EliteHubX', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        {/* Monetag — zone 229073 (Vercel domain) */}
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="229073"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer style={{ textAlign: 'center', padding: '2rem 1rem', marginTop: '4rem', borderTop: '1px solid rgba(124,58,237,0.12)', color: '#334155', fontSize: '0.82rem' }}>
            <p>© 2025 EliteHubX · Free PC Games Download · We do not host any game files · All links redirect to official sources</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
