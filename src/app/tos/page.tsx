import Footer from "@/app/modules/components/footer.module";
import Header from "@/app/modules/components/header.module";
import style from '@/app/styles/tutorials/common.module.css';
import { CustomLink } from "../modules/components/search.module";

const Main = () => {
    return (
        <body>
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <div className={style.animated}>
                        <h1 style={{ marginTop: 0, fontSize: '1.8rem' }}>Правила сайта</h1>
                        <h3>1. Правила создания повязки</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>1.1</b> Все повязки должны являться повязками. Все сторонние изображения, подошедшие под их размер будут отклонены.<br />
                            <b>1.2</b> Запрещено использование на повязке слов/символик, запрещённых на территории РФ, а так же запрещённых правилами пользования сервисами Twitch, Discord, YouTube.<br />
                            <b>1.3</b> Все повязки являются собственностью их автора и отражают только его точку зрения. Администрация сайта не несёт ответственности за публикуемый на сайте контент.<br />
                            <b>1.4</b> Запрещена публикация чужих работ без разрешения/указания автора. В подобных случаях, по заявлению автора повязки, она будет полностью удалена с сайта. Примечание: это не относится к повязкам, автор которых был утерян или прошло достаточно времени, чтобы повязка считалась работой без автора.<br />
                            <b>1.5</b> Запрещена повторная публикация повязок, которые уже существуют, были отклонены или удалены Администрацией.<br />
                        </p>

                        <h3>2. Правила публикации текстового контента</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>2.1</b> Текстовым контентом является всё, что публикует Пользователь в формате текста (Заголовок, описание).<br />
                            <b>2.2</b> Запрещено использование слов и выражений, запрещённых на территории РФ, а так же правилами пользования сервисами Twitch, Discord, YouTube.<br />
                            <b>2.3</b> Весь текстовый контент, публикуемый Пользователем на сайте отражает только точку зрения Пользователя. Администрация сайта не несёт ответственности за публикуемый текстовый контент.<br />
                        </p>

                        <h3>3. Правила использования категорий</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>3.1</b> Все категории, указанные на повязке должны точно описывать работу.<br />
                            <b>3.2</b> Запрещено намеренное повышенное использование категорий. Работа с подобным нарушениям будет принудительно отклонена.<br />
                            <b>Дополнительно:</b> Пользователь может запросить у Администрации сайта добавление новой категории. После рассмотрения запроса, категория будет доступна в редакторе всем желающим.<br />
                        </p>

                        <h3>4. Действия администрации и модерация</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>4.1</b> Окончательное решение всегда остаётся за Администрацией сайта.<br />
                            <b>4.2</b> Администрация сайта может в любой момент отправить повязку на повторную модерацию, отклонить после одобрения или полностью удалить.<br />
                            <b>4.3</b> При несоблюдении Пользователем настоящих Правил, Администрация в праве заблокировать учётную запись Пользователя без возможности разблокировки.<br />
                            <b>4.4</b> Если Пользователь был заблокирован в сети серверов ПепеЛэнд, он автоматически блокируется на сайте.<br />
                            <b>4.5</b> Все работы заблокированного Пользователя остаются на сайте, но не будут видны и доступны другим Пользователям. После разблокировки все работы вернуться в Мастерскую.<br />
                            <b>4.6</b> Модерация сети серверов ПепеЛэнд в праве запросить удаление повязки и блокировку Пользователя.<br />
                            <b>4.7</b> Модерация сети серверов ПепеЛэнд в праве запросить данные повязки и пользователя, включая Discord username и user id.<br />
                        </p>

                        <h3>5. Общие правила</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>5.1</b> Запрещено использовать несколько аккаунтов для обхода ограничений, наложенных Администрацией или лимита в 5 одновременных повязок на проверке.<br />
                            <b>5.2</b> Запрещено производить на сайте действия, вызывающие проблемы с использованием сайта у других Пользователей, а так же выводящие сервера сайта из строя.<br />
                            <b>5.3</b> Запрещена публикация контента, который содержит любое оскорбление, относящееся к полу, религии, расе, национальности и т.п.
                        </p>

                        <h1 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>Политика конфиденциальности</h1>

                        <h3>1. Сбор информации</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>1.1</b> При авторизации через Discord Сервис собирает следующие данные:
                        </p>
                        <ul style={{ marginLeft: '2rem' }}>
                            <li>Имя пользователя</li>
                            <li>Идентификатор пользователя (ID)</li>
                            <li>Изображение профиля</li>
                        </ul>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>1.2</b> Мы не храним пароли или другие конфиденциальные данные ваших учетных записей Discord.<br />
                        </p>

                        <h3>2. Использование информации</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            Собранная информация используется для следующих целей:
                        </p>
                        <ul style={{ marginLeft: '2rem' }}>
                            <li>Авторизация и предоставление доступа к Сервису</li>
                            <li>Обеспечение функциональности Сервиса</li>
                            <li>Предоставление технической поддержки</li>
                            <li>Анализ и улучшение работы Сервиса</li>
                            <li>Персонализация взаимодействия с пользователями</li>
                        </ul>

                        <h3>3. Хранение данных</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>3.1</b> Сервис хранит данные пользователей до тех пор, пока это необходимо для выполнения целей, описанных в настоящей Политике конфиденциальности, либо в течение срока, установленного законодательством.<br />
                            <b>3.2</b> Пользователи имеют право потребовать удаления своих данных. Для этого они могут связаться с нами через контактные данные, указанные в разделе 8.<br />
                        </p>

                        <h3>4. Файлы Cookie</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>4.1</b> Сервис использует файлы cookie для улучшения взаимодействия с пользователями и персонализации контента.<br />
                            <b>4.2</b> Пользователи могут управлять файлами cookie через настройки браузера. Отключение файлов cookie может повлиять на работу некоторых функций Сервиса.<br />
                        </p>

                        <h3>5. Обмен информацией с третьими лицами</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>5.1</b> Мы не передаем информацию третьим лицам, за исключением случаев, когда это требуется законодательством или при сотрудничестве с поставщиками услуг, которые соблюдают правила конфиденциальности.<br />
                        </p>

                        <h3>6. Безопасность данных</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>6.1</b> Сервис принимает разумные меры для защиты данных пользователей от несанкционированного доступа, изменения или раскрытия.<br />
                            <b>6.2</b> Пользователи обязаны соблюдать меры предосторожности и не передавать свои учетные данные третьим лицам.<br />
                        </p>

                        <h3>7. Изменения в политике</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            <b>7.1</b> Сервис оставляет за собой право вносить изменения в Политику конфиденциальности.<br />
                            <b>7.2</b> Изменения будут опубликованы на сайте Сервиса.<br />
                        </p>

                        <h3>8. Контактная информация</h3>
                        <p style={{ marginLeft: '1rem' }}>
                            Если у вас возникли вопросы или предложения по поводу настоящей Политики конфиденциальности, пожалуйста, свяжитесь с нами по контактам, указанным на <CustomLink href="/contacts">этой</CustomLink> странице.
                        </p>

                    </div>
                </div>
            </main>
            <Footer />
        </body>
    );
}

export default Main;
