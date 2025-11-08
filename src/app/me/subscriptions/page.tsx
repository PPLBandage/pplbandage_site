'use client';

import { Subscription } from '@/components/me/subscriptions/Subscription';
import { getSubscriptions } from '@/lib/api/user';
import useSWR from 'swr';
import styles from '@/styles/me/subscriptions.module.css';
import { Placeholder } from '@/components/me/Placeholder';
import style_sidebar from '@/styles/me/sidebar.module.css';

const Page = () => {
    const { data } = useSWR(
        'me-subscriptions',
        async () => await getSubscriptions()
    );

    if (!data) return undefined;
    if (data.length === 0) return <Placeholder />;

    return (
        <div className={style_sidebar.hidable}>
            <h2 style={{ marginTop: 0 }}>Ваши подписки</h2>
            <div className={styles.parent}>
                {data.map((user, i) => (
                    <Subscription key={i} {...user} />
                ))}
            </div>
        </div>
    );
};

export default Page;
