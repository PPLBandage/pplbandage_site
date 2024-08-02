import { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Правила · Повязки Pepeland',
    description: 'Правила использования сайта.',
    openGraph: {
        title: 'Правила · Повязки Pepeland',
        description: 'Правила использования сайта.'
    }
}

export default function MeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>{children}</>
    );
}
