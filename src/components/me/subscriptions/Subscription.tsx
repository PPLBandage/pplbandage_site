import { SubscriptionsType, unsubscribeFrom } from '@/lib/api/user';
import { formatDateHuman } from '@/lib/time';
import Image from 'next/image';
import styles from '@/styles/me/subscriptions.module.css';
import Link from 'next/link';
import { IconUserX } from '@tabler/icons-react';
import { mutate } from 'swr';

export const Subscription = (props: SubscriptionsType) => {
    return (
        <div className={styles.container}>
            <div className={styles.container_2}>
                <Image
                    src={
                        process.env.NEXT_PUBLIC_DOMAIN +
                        `/api/v1/avatars/${props.id}`
                    }
                    alt={props.name}
                    width={50}
                    height={50}
                />
                <div className={styles.name_container}>
                    <Link href={`/users/${props.username}`}>
                        <h3>{props.name}</h3>
                    </Link>
                    <p>На сайте с {formatDateHuman(new Date(props.joined_at))}</p>
                </div>
            </div>
            <div className={styles.unsubscribe}>
                <IconUserX
                    onClick={() =>
                        unsubscribeFrom(props.username).then(() =>
                            mutate('me-subscriptions')
                        )
                    }
                />
                <span className={styles.unsubscribe_text}>Отписаться</span>
            </div>
        </div>
    );
};
