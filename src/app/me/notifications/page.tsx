"use client";

import React, { useEffect, useRef, useState } from 'react';
import { redirect, } from "next/navigation";
import Style from "@/app/styles/me/notifications.module.css";
import Header from "@/app/modules/header.module";
import useCookie from '@/app/modules/useCookie.module';
import { Me } from '@/app/modules/me.module';
import { authApi } from '@/app/modules/api.module';
import { formatDate } from '@/app/modules/card.module';
import { Paginator } from '@/app/modules/paginator.module';
import style_sidebar from "@/app/styles/me/sidebar.module.css";
import Image from "next/image";
import { Cookies, useCookies } from 'next-client-cookies';

interface NotificationsInterface {
    data: {
        id: number,
        content: string,
        author: string,
        type: number,
        creation_date: Date
    }[],
    total_count: number
}

const Notifications = () => {
    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const [notifications, setNotifications] = useState<NotificationsInterface>(null);
    const [page, setPage] = useState<number>(0);

    if (!cookies.current.get('sessionId')) {
        redirect('/me');
    }

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    useEffect(() => {
        if (page < 0) return;
        authApi.get('user/me/notifications', { params: { page: page } }).then((response) => {
            if (response.status === 200) {
                setNotifications(response.data);
            }
        });
    }, [page]);

    const notifications_el = notifications?.data.map((notification) => {
        let classN = Style.default;
        switch (notification.type) {
            case 1:
                classN = Style.pass;
                break;
            case 2:
                classN = Style.denied;
                break;
        }
        return (
            <div key={notification.id} className={`${Style.notification_container} ${classN}`}>
                <div className={Style.date_container}>
                    <h1>{notification.author}</h1>
                    <p>{formatDate(new Date(notification.creation_date))}</p>
                </div>
                <p dangerouslySetInnerHTML={{ __html: notification.content }} className={Style.content} />
            </div>
        );
    })

    return (
        <body>
            <title>Уведомления · Повязки Pepeland</title>
            <meta name="description" content="Ваши уведомления." />
            <meta name="og:title" content="Уведомления · Повязки Pepeland" />
            <meta name="og:description" content="Ваши уведомления." />
            <Header />
            <Me>
                <div className={Style.container} style={notifications != null ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }}>
                    {notifications?.data.length > 0 ?
                        <>
                            {notifications?.total_count > 5 && <Paginator total_count={notifications?.total_count} take={5} onChange={(page) => setPage(page || 0)} />}
                            {notifications_el}
                        </> :
                        <div className={style_sidebar.animated} style={notifications != null ? { opacity: "1", transform: "translateY(0)", width: "100%" } : { opacity: "0", transform: "translateY(50px)", width: "100%" }}>
                            <p style={{ display: "flex", alignItems: "center", fontSize: "1.1rem", fontWeight: 500, width: "100%", justifyContent: "center", margin: 0 }}><Image style={{ marginRight: ".5rem" }} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />Похоже, тут ничего нет</p>
                        </div>
                    }
                </div>
            </Me>
        </body>
    );
}

export default Notifications;