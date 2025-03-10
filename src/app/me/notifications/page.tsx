'use client';

import React, { useEffect, useState } from 'react';
import Style from '@/app/styles/me/notifications.module.css';
import { formatDate } from '@/app/modules/components/Card';
import { Paginator } from '@/app/modules/components/Paginator';
import style_sidebar from '@/app/styles/me/sidebar.module.css';
import ApiManager from '@/app/modules/utils/apiManager';
import { NotificationsInterface } from '@/app/interfaces';
import sanitizeHtml from 'sanitize-html';
import { Placeholder } from '../Placeholder';

const Notifications = () => {
    const [notifications, setNotifications] =
        useState<NotificationsInterface | null>(null);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        if (page < 0) return;
        ApiManager.getMeNotifications({ page })
            .then(setNotifications)
            .catch(console.error);
    }, [page]);

    if (notifications === null) return null;
    if (notifications.data.length === 0) return <Placeholder />;
    return (
        <div
            id="sidebar"
            className={`${Style.container} ${style_sidebar.hidable}`}
        >
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

const generateNotifications = (notifications: NotificationsInterface) => {
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
