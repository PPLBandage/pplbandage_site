import Style from '@/styles/me/connections.module.css';
import {
    IconBrandGoogleFilled,
    IconPlugConnected,
    IconX
} from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import { formatDateHuman } from '@/lib/time';
import DisconnectHelper from './DisconnectHelper';
import { disconnectGoogle, getMeConnections } from '@/lib/api/connections';

export const Google = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandGoogleFilled />
                Google аккаунт
            </h3>
            {!!data.google ? <Connected data={data} /> : <NotConnected />}
        </div>
    );
};

const Connected = ({ data }: { data: ConnectionsResponse }) => {
    return (
        <>
            <div className={Style.discord_container}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data.userID}/google`}
                    alt="avatar"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%' }}
                />
                <div className={Style.discord_name_container}>
                    <h1>{data.google.name}</h1>
                    <p className={Style.discord_name_container_p}>
                        {data.google.email}
                    </p>
                </div>
            </div>
            <div className={Style.disconnect_container}>
                <p className={Style.discord_name_container_p}>
                    Подключено {formatDateHuman(new Date(data.google.connected_at))}
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
        'Отвязать учётную запись Google? Вы больше не сможете войти этим методом'
    );
    if (!confirmed) return;

    disconnectGoogle()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const NotConnected = () => {
    return (
        <div>
            <span>
                Подключите свой Google-аккаунт, чтобы использовать вход через Google.
            </span>
            <a
                className={Style.unlink}
                style={{ textDecoration: 'none', marginTop: '1rem' }}
                href={
                    process.env.NEXT_PUBLIC_API_URL + 'auth/url/google?connect=true'
                }
            >
                <IconPlugConnected />
                Подключить
            </a>
        </div>
    );
};
