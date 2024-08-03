import Footer from "../modules/footer.module";
import Header from "../modules/header.module";
import style from '@/app/styles/tutorials/common.module.css';

const Main = () => {
    return (
        <body>
            <title>Правила · Повязки Pepeland</title>
            <meta name="description" content="Правила использования сайта." />
            <meta name="og:title" content="Правила · Повязки Pepeland" />
            <meta name="og:description" content="Правила использования сайта." />
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <div className={style.animated}>
                        <h1 style={{ marginTop: 0, fontSize: '1.8rem' }}>Правила сайта</h1>
                        <h2>1. Правила создания повязки</h2>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>1.1.</b> Все повязки должны являться повязками. Все сторонние изображения, подошедшие под их размер будут отклонены.<br />
                            <b>1.2.</b> Запрещено использование на повязке слов/символик, запрещённых на территории РФ, а так же запрещённых правилами пользования сервисами Twitch, Discord, YouTube.<br />
                            <b>1.3.</b> Все повязки являются собственностью их автора и отражают только его точку зрения. Администрация сайта не несёт ответственности за публикуемый на сайте контент.<br />
                            <b>1.4.</b> Запрещена публикация чужих работ без разрешения/указания автора. В подобных случаях, по заявлению автора повязки, она будет полностью удалена с сайта. Примечание: это не относится к повязкам, автор которых был утерян или прошло достаточно времени, чтобы повязка считалась работой без автора.<br />
                            <b>1.5.</b> Запрещена повторная публикация повязок, которые уже существуют, были отклонены или удалены Администрацией.<br />
                        </p>

                        <h2>2. Правила публикации текстового контента</h2>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>2.1.</b> Текстовым контентом является всё, что публикует Пользователь в формате текста (Заголовок, описание).<br />
                            <b>2.2.</b> Запрещено использование слов и выражений, запрещённых на территории РФ, а так же правилами пользования сервисами Twitch, Discord, YouTube.<br />
                            <b>2.3.</b> Весь текстовый контент, публикуемый Пользователем на сайте отражает только точку зрения Пользователя. Администрация сайта не несёт ответственности за публикуемый текстовый контент.<br />
                        </p>

                        <h2>3. Правила использования категорий</h2>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>3.1.</b> Все категории, указанные на повязке должны точно описывать работу.<br />
                            <b>3.2.</b> Запрещено намеренное повышенное использование категорий. Работа с подобным нарушениям будет принудительно отклонена.<br />
                            <b>Дополнительно:</b> Пользователь может запросить у Администрации сайта добавление новой категории. После рассмотрения запроса, категория будет доступна в редакторе всем желающим.<br />
                        </p>

                        <h2>4. Действия администрации и модерация</h2>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>4.1.</b> Окончательное решение всегда остаётся за Администрацией сайта.<br />
                            <b>4.2.</b> Администрация сайта может в любой момент отправить повязку на повторную модерацию, отклонить после одобрения или полностью удалить.<br />
                            <b>4.3.</b> При несоблюдении Пользователем настоящих Правил, Администрация в праве заблокировать учётную запись Пользователя без возможности разблокировки.<br />
                            <b>4.4.</b> Если Пользователь был заблокирован в сети серверов ПепеЛенд, он автоматически блокируется на сайте.<br />
                            <b>4.5.</b> Все работы заблокированного Пользователя остаются на сайте, но не будут видны и доступны другим Пользователям. После разблокировки все работы вернуться в Мастерскую.<br />
                            <b>4.6.</b> Модерация сети серверов ПепеЛенд в праве запросить удаление повязки и блокировку Пользователя.<br />
                            <b>4.7.</b> Модерация сети серверов ПепеЛенд в праве запросить данные повязки и пользователя, включая Discord username и user id.<br />
                        </p>

                        <h2>5. Общие правила</h2>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>5.1.</b> Запрещено использовать несколько аккаунтов для обхода ограничений, наложенных Администрацией или лимита в 5 одновременных повязок на проверке.<br />
                            <b>5.2.</b> Запрещено производить на сайте действия, вызывающие проблемы с использованием сайта у других Пользователей, а так же выводящие сервера сайта из строя.<br />
                            <b>5.3.</b> Запрещена публикация контента, который содержит любое оскорбление, относящееся к полу, религии, расе, национальности и т.п.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </body>
    );
}

export default Main;
