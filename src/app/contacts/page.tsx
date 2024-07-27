import Link from "next/link";
import Header from "../modules/header.module";
import style from '@/app/styles/contacts/contacts.module.css';

const Home = () => {
    return (
        <body>
            <title>Контакты · Повязки Pepeland</title>
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