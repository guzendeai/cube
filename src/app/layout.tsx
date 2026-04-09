// src/app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans-jp',
});

const notoSerifJP = Noto_Serif_JP({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif-jp',
});

export const metadata: Metadata = {
  title: 'Portfolio — 回る記録',
  description: '立方体を回しながら、活動の記録に出会う。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}