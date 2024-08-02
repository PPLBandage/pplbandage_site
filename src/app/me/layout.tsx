import { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Личный кабинет · Повязки Pepeland',
    description: 'Личный кабинет создателя повязок.',
    openGraph: {
        title: 'Личный кабинет · Повязки Pepeland',
        description: 'Личный кабинет создателя повязок.'
    }
}

export default function MeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>{children}</>
    );
}
