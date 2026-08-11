import type { Metadata, Viewport } from 'next';
import { Newsreader, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const serif = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ethanyanxu.com'),
  title: {
    default: 'Ethan Yan Xu — an atlas by scale',
    template: '%s — Ethan Yan Xu',
  },
  description:
    'The work of Ethan Yan Xu, arranged along eighteen orders of magnitude — from a 1.54 Å carbon–carbon bond to an ocean basin. Every station is a working instrument.',
  authors: [{ name: 'Ethan Yan Xu', url: 'https://github.com/OoEthanoO' }],
  openGraph: {
    type: 'website',
    title: 'Ethan Yan Xu — an atlas by scale',
    description:
      'Eighteen orders of magnitude of built work, from a carbon–carbon bond to an ocean basin.',
    url: 'https://www.ethanyanxu.com',
    siteName: 'Ethan Yan Xu',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efeae0' },
    { media: '(prefers-color-scheme: dark)', color: '#14130f' },
  ],
};

/**
 * Applied before first paint so a stored theme choice never flashes. Kept
 * deliberately tiny and dependency-free.
 */
const THEME_BOOT = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
