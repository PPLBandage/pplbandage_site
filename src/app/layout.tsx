import type { Metadata } from "next";
import Providers from "@/app/providers.module";
import "./styles/layout.css";
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata: Metadata = {
	title: 'Повязки Pepeland',
	description: 'Повязки Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!',
	manifest: '/static/manifest.webmanifest',
	icons: {
		icon: '/static/icons/icon.svg',
		shortcut: '/static/icons/icon.svg',
		apple: '/static/icons/icon.svg'
	},
	creator: 'AndcoolSystems',
	other: {
		'darkreader-lock': 'darkreader-lock',
		'theme-color': '#0f766e'
	}
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<CookiesProvider>
			<Providers>
				{children}
			</Providers>
		</CookiesProvider>
	);
}
