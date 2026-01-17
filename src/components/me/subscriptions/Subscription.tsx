import { subscribeTo, SubscriptionsType, unsubscribeFrom } from '@/lib/api/user';
import { formatDateHuman } from '@/lib/time';
import Image from 'next/image';
import styles from '@/styles/me/subscriptions.module.css';
import Link from 'next/link';
import { IconUserPlus, IconUserX } from '@tabler/icons-react';
import { mutate } from 'swr';
import { StaticTooltip } from '@/components/Tooltip';

export const Subscription = (props: SubscriptionsType & { mutate_key: string }) => {
    const Icon = (props.subscribed ?? true) ? IconUserX : IconUserPlus;
    const action = (props.subscribed ?? true) ? unsubscribeFrom : subscribeTo;
    const text = (props.subscribed ?? true) ? 'Отписаться' : 'Подписаться';

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
            <StaticTooltip title={text} styles={styles}>
                <div className={styles.unsubscribe}>
                    <Icon
                        onClick={() =>
                            action(props.username).then(() =>
                                mutate(props.mutate_key)
                            )
                        }
                    />
                    <span className={styles.unsubscribe_text}>{text}</span>
                </div>
            </StaticTooltip>
        </div>
    );
};
