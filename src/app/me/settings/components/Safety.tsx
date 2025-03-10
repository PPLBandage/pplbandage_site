import {
    IconDeviceDesktop,
    IconDeviceMobile,
    IconShield,
    IconX
} from '@tabler/icons-react';
import style_workshop from '@/app/styles/workshop/page.module.css';
import Style_safety from '@/app/styles/me/safety.module.css';
import Style from '@/app/styles/me/connections.module.css';
import { formatDate } from '@/app/modules/components/Card';
import ApiManager from '@/app/modules/utils/apiManager';
import { timeStamp } from '@/app/modules/utils/time';
import IconSvg from '@/app/resources/icon.svg';
import { Session } from '@/app/interfaces';
import useSWR, { mutate } from 'swr';

const moveToStart = (arr: Session[]) => {
    const filteredArray = arr.filter(el => !el.is_self);
    const element = arr.find(el => el.is_self);
    if (!element) return arr;
    filteredArray.unshift(element);
    return filteredArray;
};

const logoutSession = (session_id: number) => {
    if (!confirm(`Выйти с этого устройства?`)) return;
    ApiManager.logoutSession(session_id)
        .then(() => mutate('userSessions', undefined, { revalidate: true }))
        .catch(response => alert(response.data.message));
};

const logoutSessionAll = () => {
    if (!confirm('Выйти со всех устройств, кроме этого?')) return;
    ApiManager.logoutAllSessions()
        .then(() => mutate('userSessions', undefined, { revalidate: true }))
        .catch(response => alert(response.data.message));
};

export const Safety = () => {
    return (
        <div className={Style.container}>
            <h3>
                <IconShield />
                Безопасность
            </h3>
            <h4 style={{ margin: 0 }}>Все устройства</h4>
            <div className={Style_safety.parent}>
                <Sessions />
            </div>
        </div>
    );
};

const Sessions = () => {
    const { data, isLoading } = useSWR(
        'userSessions',
        async () => await ApiManager.getSessions()
    );

    if (isLoading) return <Loading />;

    const sorted = data.sort(
        (session1, session2) =>
            new Date(session2.last_accessed).getTime() -
            new Date(session1.last_accessed).getTime()
    );

    const sessions = moveToStart(sorted).map(session => (
        <SessionCard key={session.id} session={session} />
    ));

    return (
        <>
            {sessions}
            {sessions.length > 1 && (
                <button className={Style.unlink} onClick={logoutSessionAll}>
                    <IconX />
                    Выйти со всех устройств
                </button>
            )}
        </>
    );
};

const Loading = () => {
    return (
        <IconSvg width={86} height={86} className={style_workshop.loading} />
    );
};

const SessionCard = ({ session }: { session: Session }) => {
    return (
        <div key={session.id} className={Style_safety.container}>
            <div className={Style_safety.session}>
                <h2 className={Style_safety.header}>
                    {session.is_mobile ? (
                        <IconDeviceMobile />
                    ) : (
                        <IconDeviceDesktop />
                    )}
                    {session.browser} {session.browser_version}{' '}
                    {session.is_self && <p>Это устройство</p>}
                </h2>
                <p
                    className={Style_safety.last_accessed}
                    title={formatDate(new Date(session.last_accessed))}
                >
                    Последний доступ{' '}
                    {timeStamp(
                        new Date(session.last_accessed).getTime() / 1000
                    )}
                </p>
            </div>
            {!session.is_self && (
                <button
                    className={Style_safety.button}
                    onClick={() => logoutSession(session.id)}
                >
                    <IconX />
                </button>
            )}
        </div>
    );
};
