import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Повязка PepeLand",
	description: "Повязка Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!",
	manifest: "http://localhost:3000/static/manifest.webmanifest",
	icons: "http://localhost:3000/static/icons/icon.svg"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<CookiesProvider>
			<html lang="en" className={inter.className}>
				{children}
			</html>
		</CookiesProvider>
	);
}
