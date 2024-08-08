import Link from "next/link";
import Header from "@/app/modules/components/header.module";
import style from '@/app/styles/contacts/contacts.module.css';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Контакты · Повязки Pepeland',
    description: 'Способы связи с администрацией'
}

const Home = () => {
    return (
        <body>
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <h1 style={{ marginTop: 0, width: '100%', textAlign: 'center', fontSize: '2rem' }}>Контакты</h1>
                    <p>
                        <Link href='https://andcool.ru' target="_blank">AndcoolSystems</Link> – Разработчик<br />
                        <Link href='https://vk.com/shapestd' target="_blank">Shape STD</Link> – Продакшн, дизайн повязок
                    </p>
                </div>
            </main>
        </body>
    );
}

export default Home;