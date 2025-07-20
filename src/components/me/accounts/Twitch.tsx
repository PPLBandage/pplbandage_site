import Style from '@/styles/me/connections.module.css';
import { IconBrandTwitch, IconPlugConnected, IconX } from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import { formatDateHuman } from '@/lib/time';
import DisconnectHelper from './DisconnectHelper';
import { disconnectTwitch, getMeConnections } from '@/lib/api/connections';

export const Twitch = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandTwitch />
                Twitch аккаунт
            </h3>
            {data.twitch ? <Connected data={data} /> : <NotConnected />}
        </div>
    );
};

const Connected = ({ data }: { data: ConnectionsResponse }) => {
    return (
        <>
            <div className={Style.discord_container}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data.userID}/twitch`}
                    alt="avatar"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%' }}
                />
                <div className={Style.discord_name_container}>
                    <h1>{data.twitch.name}</h1>
                    <p className={Style.discord_name_container_p}>
                        {data.twitch.login}
                    </p>
                </div>
            </div>
            <div className={Style.disconnect_container}>
                <p className={Style.discord_name_container_p}>
                    Подключено {formatDateHuman(new Date(data.twitch.connected_at))}
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
        'Отвязать учётную запись Twitch? Вы больше не сможете войти этим методом'
    );
    if (!confirmed) return;

    disconnectTwitch()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const NotConnected = () => {
    return (
        <div>
            <span>
                Подключите свой Twitch-аккаунт, чтобы использовать вход через Twitch.
            </span>
            <a
                className={Style.unlink}
                style={{ textDecoration: 'none', marginTop: '1rem' }}
                href={
                    process.env.NEXT_PUBLIC_API_URL + 'auth/url/twitch?connect=true'
                }
            >
                <IconPlugConnected />
                Подключить
            </a>
        </div>
    );
};
