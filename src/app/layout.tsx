import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: 'gtag.js',
  },
};

export const viewport: Viewport = {
  themeColor: '#07080d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <Header />
          <main>{children}</main>
          <footer
            style={{
              textAlign: 'center',
              padding: '34px 20px',
              color: 'var(--text-2)',
              fontSize: 14,
              borderTop: '1px solid var(--border)',
              marginTop: 50,
              background: 'var(--footer-bg)',
            }}
          >
            <i className="fa-solid fa-copyright" aria-hidden="true" style={{ margin: '0 4px' }} />
            2026 Movie Collection. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}