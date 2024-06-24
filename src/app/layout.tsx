import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';
import "./styles/layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Повязки PepeLand",
	description: "Повязки Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!",
	manifest: "/static/manifest.webmanifest",
	icons: {
		icon: "/static/icons/icon.svg",
		shortcut: "/static/icons/icon.svg",
		apple: "/static/icons/icon.svg"
	},
	creator: "AndcoolSystems"
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
