import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PetSoft - Pet daycare software',
  description: 'Manage your pet hotel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-sm text-zinc-900 min-h-screen bg-[#E5E8EC]`}
      >
        {children}
      </body>
    </html>
  );
}
