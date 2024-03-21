import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Повязка PepeLand"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CookiesProvider>
      <html lang="en" className={inter.className}>
        {children}
      </html>
    </CookiesProvider>
  );
}
