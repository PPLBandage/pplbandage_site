import Footer from "../modules/footer.module";
import Header from "../modules/header.module";
import style from '@/app/styles/contacts/contacts.module.css';

const Home = () => {
    return (
        <body>
            <Header/>
            <main className={style.main}>
                <div className={style.main_container}>
                    <h1 style={{marginTop: 0}}>Контакты</h1>
                </div>
            </main>
            <Footer/>
        </body>
    );
}

export default Home;