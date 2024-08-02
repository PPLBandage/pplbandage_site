import { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Мастерская · Повязки Pepeland',
    description: 'Главная страница мастерской.',
    openGraph: {
        title: 'Мастерская · Повязки Pepeland',
        description: 'Главная страница мастерской.'
    }
}

export default function MeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>{children}</>
    );
}
