import Style from '@/styles/me/connections.module.css';
import { IconBrandTelegram, IconPlugConnected, IconX } from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import { formatDateHuman } from '@/lib/time';
import DisconnectHelper from './DisconnectHelper';
import { disconnectTelegram, getMeConnections } from '@/lib/api/connections';
import Image from 'next/image';

export const Telegram = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading || !data) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandTelegram />
                Telegram аккаунт
            </h3>
            {data.telegram ? <Connected data={data} /> : <NotConnected />}
        </div>
    );
};

const Connected = ({ data }: { data: ConnectionsResponse }) => {
    return (
        <>
            <div className={Style.discord_container}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data.userID}/telegram`}
                    alt="avatar"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%' }}
                />
                <div className={Style.discord_name_container}>
                    <h1>{data.telegram!.name}</h1>
                    <p className={Style.discord_name_container_p}>
                        {data.telegram!.login || data.telegram!.id}
                    </p>
                </div>
            </div>
            <div className={Style.disconnect_container}>
                <p className={Style.discord_name_container_p}>
                    Подключено{' '}
                    {formatDateHuman(new Date(data.telegram!.connected_at))}
                </p>
                <DisconnectHelper>
                    <button className={Style.unlink} onClick={disconnect}>
                        <IconX />
                        Отвязать
                    </button>
                </DisconnectHelper>
            </div>
        </>
    );
};

const disconnect = () => {
    const confirmed = confirm(
        'Отвязать учётную запись Telegram? Вы больше не сможете войти этим методом'
    );
    if (!confirmed) return;

    disconnectTelegram()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const NotConnected = () => {
    return (
        <div className={Style.not_connected_text}>
            <span>
                Подключите свой Telegram-аккаунт, чтобы использовать вход через
                Telegram.
            </span>
            <a
                className={Style.unlink}
                style={{ textDecoration: 'none', marginTop: '1rem' }}
                href={
                    process.env.NEXT_PUBLIC_API_URL +
                    'auth/url/telegram?connect=true'
                }
            >
                <IconPlugConnected />
                Подключить
            </a>
        </div>
    );
};
