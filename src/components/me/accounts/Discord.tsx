import Style from '@/styles/me/connections.module.css';
import { IconBrandDiscord, IconPlugConnected, IconX } from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import { formatDateHuman } from '@/lib/time';
import DisconnectHelper from './DisconnectHelper';
import { disconnectDiscord, getMeConnections } from '@/lib/api/connections';

export const Discord = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandDiscord />
                Discord аккаунт
            </h3>
            {data.discord ? <Connected data={data} /> : <NotConnected />}
        </div>
    );
};

const Connected = ({ data }: { data: ConnectionsResponse }) => {
    return (
        <>
            <div className={Style.discord_container}>
                {data.discord && (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data.userID}/discord`}
                        alt="avatar"
                        width={64}
                        height={64}
                        style={{ borderRadius: '50%' }}
                    />
                )}
                <div className={Style.discord_name_container}>
                    <h1>{data.discord.name}</h1>
                    <p className={Style.discord_name_container_p}>
                        {data.discord.username}
                    </p>
                </div>
            </div>
            <div className={Style.disconnect_container}>
                <p className={Style.discord_name_container_p}>
                    Подключено {formatDateHuman(new Date(data.discord.connected_at))}
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
        'Отвязать учётную запись Discord? Вы больше не сможете войти этим методом'
    );
    if (!confirmed) return;

    disconnectDiscord()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const NotConnected = () => {
    return (
        <div>
            <span>
                Подключите свой Discord-аккаунт, чтобы использовать вход через
                Discord.
            </span>
            <a
                className={Style.unlink}
                style={{ textDecoration: 'none', marginTop: '1rem' }}
                href={
                    process.env.NEXT_PUBLIC_API_URL + 'auth/url/discord?connect=true'
                }
            >
                <IconPlugConnected />
                Подключить
            </a>
        </div>
    );
};
