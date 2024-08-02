import { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Туториалы · Повязки Pepeland',
    description: 'Общее описание работы на сайте.',
    openGraph: {
        title: 'Туториалы · Повязки Pepeland',
        description: 'Общее описание работы на сайте.'
    }
}

export default function MeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>{children}</>
    );
}
