import type { Metadata } from "next";
import Providers from "@/app/modules/providers.module";
import "./styles/layout.css";
import { CookiesProvider } from 'next-client-cookies/server';
import { headers } from 'next/headers';
import OpenGraph from '@/app/openGraph.json';
import { merge } from 'lodash';

export const generateMetadata = async (): Promise<Metadata> => {
	const headersList = headers();
	const path = headersList.get('X-Forwarded-Path').split('?')[0];  // Working only with Nginx config!
	const object = (OpenGraph as { [key: string]: any });
	const base = OpenGraph.base;
	const extend = object[path];
	return merge({}, base, extend) as Metadata;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<CookiesProvider>
			<Providers>
				{children}
			</Providers>
		</CookiesProvider>
	);
}
