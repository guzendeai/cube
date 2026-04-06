import './globals.css';

export const metadata = {
  title: 'cube',
  description: '3D cube site',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
