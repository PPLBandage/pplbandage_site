'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Style from '@/app/styles/me/notifications.module.css';
import { Me } from '@/app/modules/components/MeSidebar';
import { formatDate } from '@/app/modules/components/Card';
import { Paginator } from '@/app/modules/components/Paginator';
import style_sidebar from '@/app/styles/me/sidebar.module.css';
import Image from 'next/image';
import ApiManager from '@/app/modules/utils/apiManager';
import { NotificationsInterface } from '@/app/interfaces';
import sanitizeHtml from 'sanitize-html';
import { useNextCookie } from 'use-next-cookie';

const Notifications = () => {
    const logged = useNextCookie('sessionId', 1000);
    const [notifications, setNotifications] =
        useState<NotificationsInterface | null>(null);
    const [page, setPage] = useState<number>(0);

    if (!logged) redirect('/me');

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    useEffect(() => {
        if (page < 0) return;
        ApiManager.getMeNotifications({ page })
            .then(setNotifications)
            .catch(console.error);
    }, [page]);

    const notifications_el = notifications?.data.map(notification => {
        let classN = Style.default;
        switch (notification.type) {
            case 1:
                classN = Style.pass;
                break;
            case 2:
                classN = Style.denied;
                break;
        }

        const cleanString = sanitizeHtml(notification.content, {
            allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                a: ['href']
            }
        });
        return (
            <div
                key={notification.id}
                className={`${Style.notification_container} ${classN}`}
            >
                <div className={Style.date_container}>
                    <h1>{notification.author}</h1>
                    <p>{formatDate(new Date(notification.creation_date))}</p>
                </div>
                <p
                    dangerouslySetInnerHTML={{ __html: cleanString }}
                    className={Style.content}
                />
            </div>
        );
    });

    return (
        <main>
            <Me>
                <div
                    id="sidebar"
                    className={Style.container}
                    style={
                        notifications != null
                            ? { opacity: '1', transform: 'translateY(0)' }
                            : { opacity: '0', transform: 'translateY(50px)' }
                    }
                >
                    {notifications?.data.length > 0 ? (
                        <>
                            {notifications?.total_count > 5 && (
                                <Paginator
                                    total_count={notifications?.total_count}
                                    take={5}
                                    onChange={page => setPage(page || 0)}
                                    page={page}
                                />
                            )}
                            {notifications_el}
                        </>
                    ) : (
                        <div
                            className={style_sidebar.animated}
                            style={
                                notifications != null
                                    ? {
                                          opacity: '1',
                                          transform: 'translateY(0)',
                                          width: '100%'
                                      }
                                    : {
                                          opacity: '0',
                                          transform: 'translateY(50px)',
                                          width: '100%'
                                      }
                            }
                        >
                            <p
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    width: '100%',
                                    justifyContent: 'center',
                                    margin: 0
                                }}
                            >
                                <Image
                                    style={{ marginRight: '.5rem' }}
                                    src="/static/theres_nothing_here.png"
                                    alt=""
                                    width={56}
                                    height={56}
                                />
                                Похоже, тут ничего нет
                            </p>
                        </div>
                    )}
                </div>
            </Me>
        </main>
    );
};

export default Notifications;
