"use client";

import Footer from "../modules/footer.module";
import Header from "../modules/header.module";
import React, { useEffect, useState } from "react";
import style from '@/app/styles/tutorials/common.module.css';
import ASide from "./header.module";
import InfoCard from "../modules/info.module";
import NextImage from "next/image";
import { CategoryEl } from "../modules/card.module";
import { CustomLink } from "../modules/search.module";
import styles from "../styles/me/me.module.css";
import { Tooltip } from "../modules/tooltip";
import axios from "axios";
import { Role } from "../interfaces";
import style_workshop from "@/app/styles/workshop/page.module.css";

export default function Home() {
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + `oauth/roles`).then((response) => {
            if (response.status === 200) {
                setRoles(response.data);
            }
        })
    }, [])

    const dat = roles.map((role) => {
        return (
            <div key={role.id} className={styles.role_container}>
                <span style={{ backgroundColor: "#" + role.color.toString(16) }} className={styles.role_dot}>
                </span>
                <span className={styles.role_title}>{role.title}</span>
            </div>
        )
    })
    return (
        <body>
            <title>Туториалы · Повязки Pepeland</title>
            <meta name="description" content="Общее описание работы на сайте." />
            <meta name="og:description" content="Общее описание работы на сайте." />
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <ASide />
                    <div className={style.animated}>
                        <h1 style={{ marginTop: 0, fontSize: '2rem' }}>Повязки Pepeland</h1>
                        <p>В этом разделе вы найдете все что нужно знать о регистрации и работе на сайте, а так же о создании повязок.</p>

                        <h2>Мастерская</h2>
                        <p>Мастерская – это главное место, где вы можете найти то, что ищите. В мастерской отображаются все повязки, которые были одобрены администрацией и имеющие публичный доступ.
                            Доступ к мастерской имеют все без исключения пользователи, как зарегистрированные, так и нет.</p>

                        <h2>Регистрация на сайте</h2>
                        <span style={{ display: 'block', marginBottom: '1rem' }}>Регистрация разрешена только пользователям, являющимися членами Discord сервера PWGood,
                            а так же имеющие определенные <Tooltip
                                body={
                                    <div className={styles.roles_container}>
                                        {dat.length > 0 ? dat : <NextImage src="/static/icons/icon.svg" alt="" width={86} height={86} className={style_workshop.loading} />}
                                    </div>
                                }
                                opacity="1"
                                timeout={0}
                                className={styles.roles_text_container}>
                                <span className={styles.roles_text}> роли</span>
                            </Tooltip>.
                            При регистрации сайт сохраняет ваш никнейм с учётной записи Discord.
                            Дальнейшее его изменение возможно только через администрацию сайта.</span>
                        <InfoCard color="#4493F8" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/note.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Примечание</p>
                            </div>}>
                            <p style={{ margin: 0 }}>Если ваш никнейм будет содержать слова и выражения, запрещенные правилами сайта, администрация может принудительно заменить его на другой. Последующая смена будет доступна так же через администрацию.</p>
                        </InfoCard>

                        <h2>Интеграции</h2>
                        <p>Сайт позволяет искать скины через встроенную базу Minecraft ников, которые постоянно пополняются автоматически при поиске нового никнейма. Вы можете привязать свой Minecraft аккаунт к учётной записи PPLBandage через сервис <CustomLink href="https://github.com/Andcool-Systems/MC-OAuth_server">mc-oauth</CustomLink>.
                            Для привязки вам нужно зайти на Minecraft сервер <u>oauth.pplbandage.ru</u> для версии начиная с 1.8 и получить там 6-значный код, который нужно будет ввести на странице <CustomLink href='/me/connections'>/me/connections</CustomLink>.</p>
                        <InfoCard color="#3FB950" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/tip.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Заметка</p>
                            </div>}>
                            <p style={{ margin: 0 }}>Сервис <span style={{ color: "rgba(12, 247, 215)" }}>mc-oauth</span> был разработан специально для этого сайта. Он полностью повторяет систему авторизации оригинальных серверов Minecraft и получает доступ только к никнейму и UUID.</p>
                        </InfoCard>
                        <p>После привязки Minecraft аккаунта к аккаунту PPLBandage, вы сможете обновлять кэш скинов когда угодно, включать/выключать отображение вашего ника в поиске скинов, а так же включить автоматическую загрузку скина в редакторе.</p>

                        <h2>Публикация повязок</h2>
                        <InfoCard color="#3FB950" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/tip.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Заметка</p>
                            </div>}>
                            <p style={{ margin: 0 }}>Подробнее о создании повязок читайте на странице <CustomLink href='/tutorials/bandage'>/tutorials/bandage</CustomLink>.</p>
                        </InfoCard>
                        <p>Публикация повязок доступна только зарегистрированным пользователям.<br />
                            Все повязки имеют информацию, содержащую название, описание и категории.</p>

                        <h3>Ограничения информации о повязке:</h3>
                        <ul>
                            <li><b>Название:</b> не более 50 символов</li>
                            <li><b>Описание:</b> не более 300 символов</li>
                            <li><b>Категории:</b> без ограничений</li>
                        </ul>
                        <InfoCard color="#4493F8" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/note.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Примечание</p>
                            </div>}>
                            <p style={{ margin: 0 }}>После создания повязки изменить её внешний вид будет <u>невозможно</u>.</p>
                        </InfoCard>

                        <p>При создании или изменении повязки описание можно не указывать.<br />
                            После создания повязки она будет автоматически отправлена на модерацию. Модерация проходит от 24 до 48 часов.</p>

                        <h2>Модерация повязок</h2>
                        <p>Все повязки после создания должны пройти обязательную модерацию. До тех пор повязка не будет доступна из мастерской и видна по ссылке только вам. Во время модерации вы можете так же редактировать информацию о повязке, но после одобрения повязки, изменить название и описание будет возможно только через администрацию сайта.</p>

                        <p>В ходе модерации ваша повязка так же может быть отклонена. Это означает, что информация о ней или изображение повязки не соответствует правилам сайта. При отклонении вашей работы, вы можете узнать причины у администрации сайта.<br />
                            <b>Отклонение повязки не означает её удаление.</b> При отклонении повязки вы сможете повторно запросить ее модерацию, устранив перед этим причину отказа.</p>

                        <InfoCard color="#4493F8" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/note.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Примечание</p>
                            </div>}>
                            <p style={{ margin: 0 }}>Вы не можете иметь одновременно более 5 повязок на проверке. Общих ограничений по количеству повязок нет.</p>
                        </InfoCard>

                        <h2>Категории</h2>
                        <p>Любая повязка может иметь категории, это помогает пользователям легче искать работы. Любая повязка может иметь неограниченное количество категорий. Категории, установленные на вашей работе должны точно её описывать. Не стоит ими злоупотреблять.</p>

                        <InfoCard color="#D29922" title={
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <NextImage alt='' src='/static/icons/blocks/warning.svg' width={20} height={20} />
                                <p style={{ margin: 0 }}>Внимание</p>
                            </div>}>
                            <p style={{ margin: 0 }}>Злоупотребление категориями может привести к блокировке повязки.</p>
                        </InfoCard>

                        <span style={{ display: 'block', marginTop: '.5rem', marginBottom: '.5rem' }}>Некоторые категории несут больше чем информативный характер. К примеру, категория <CategoryEl style={{ display: 'inline-flex', height: '1rem', verticalAlign: 'top' }} category={{
                            id: -1,
                            name: "Окрашиваемые",
                            icon: '/dynamic/categories/color-palette.svg'
                        }} /> показывает, что эта повязка имеет возможность окрашивания, и на странице повязки будет отображён соответствующий элемент для выбора цвета.</span>
                    </div>
                </div>
                <Footer />
            </main>
        </body>
    )
}