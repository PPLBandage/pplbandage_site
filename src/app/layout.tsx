import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/providers.module";
import "./styles/layout.css";
import { CookiesProvider } from 'next-client-cookies/server';

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
		<html lang="ru" className={inter.className}>
			<CookiesProvider>
				<Providers>
					{children}
				</Providers>
			</CookiesProvider>
		</html>
	);
}
