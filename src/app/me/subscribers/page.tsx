'use client';

import { Subscription } from '@/components/me/subscriptions/Subscription';
import { getSubscribers } from '@/lib/api/user';
import useSWR from 'swr';
import styles from '@/styles/me/subscriptions.module.css';
import { Placeholder } from '@/components/me/Placeholder';
import style_sidebar from '@/styles/me/sidebar.module.css';

const Page = () => {
    const { data: dataSubscribers } = useSWR(
        'me-subscribers',
        async () => await getSubscribers()
    );

    if (!dataSubscribers) return undefined;
    if (dataSubscribers.length === 0) return <Placeholder />;

    return (
        <div className={style_sidebar.hidable}>
            <h2 style={{ marginTop: 0 }}>Ваши подписчики</h2>
            <div className={styles.parent}>
                {dataSubscribers.map((user, i) => (
                    <Subscription key={i} {...user} mutate_key="me-subscribers" />
                ))}
            </div>
        </div>
    );
};

export default Page;
