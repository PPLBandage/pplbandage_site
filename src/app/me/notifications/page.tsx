'use client';

import React, { useEffect, useState } from 'react';
import Style from '@/styles/me/notifications.module.css';
import { Paginator } from '@/components/workshop/Paginator';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { INotifications } from '@/types/global.d';
import sanitizeHtml from 'sanitize-html';
import { Placeholder } from '@/components/me/Placeholder';
import { formatDate } from '@/lib/time';
import { getMeNotifications } from '@/lib/api/user';

const Notifications = () => {
    const [notifications, setNotifications] = useState<INotifications>(null);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        if (page < 0) return;
        getMeNotifications({ page }).then(setNotifications).catch(console.error);
    }, [page]);

    if (notifications === null) return null;
    if (notifications.data.length === 0) return <Placeholder />;
    return (
        <div id="sidebar" className={`${Style.container} ${style_sidebar.hidable}`}>
            {notifications.total_count > 5 && (
                <Paginator
                    total_count={notifications?.total_count}
                    take={5}
                    onChange={page => setPage(page || 0)}
                    page={page}
                />
            )}
            {generateNotifications(notifications)}
        </div>
    );
};

const generateNotifications = (notifications: INotifications) => {
    return notifications?.data.map(notification => {
        let classN = undefined;
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
};

export default Notifications;
