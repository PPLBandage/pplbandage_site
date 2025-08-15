import {
    IconDeviceDesktop,
    IconDeviceMobile,
    IconServer,
    IconShield,
    IconX
} from '@tabler/icons-react';
import Style_safety from '@/styles/me/safety.module.css';
import Style from '@/styles/me/connections.module.css';
import { formatDate, timeStamp } from '@/lib/time';
import { Session } from '@/types/global.d';
import useSWR, { mutate } from 'swr';
import { Loading } from './Loading';
import {
    getSessions,
    logoutAllSessions,
    logoutSession as logoutSessionAPI
} from '@/lib/api/user';

const moveToStart = (arr: Session[]) => {
    const filteredArray = arr.filter(el => !el.is_self);
    const element = arr.find(el => el.is_self);
    if (!element) return arr;
    filteredArray.unshift(element);
    return filteredArray;
};

const logoutSession = (session_id: number, sessions: Session[]) => {
    if (!confirm(`Выйти с этого устройства?`)) return;

    logoutSessionAPI(session_id)
        .then(() =>
            mutate(
                'userSessions',
                sessions.filter(session => session.id !== session_id),
                true
            )
        )
        .catch(response => alert(response.data.message));
};

const logoutSessionAll = (all_sessions: Session[], current_session_id: number) => {
    if (!confirm('Выйти со всех устройств, кроме этого?')) return;
    logoutAllSessions()
        .then(() =>
            mutate(
                'userSessions',
                [all_sessions.find(session => session.id === current_session_id)],
                true
            )
        )
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
        async () => await getSessions()
    );

    if (isLoading || !data) return <Loading />;

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
                <button
                    className={Style.unlink}
                    onClick={() =>
                        logoutSessionAll(
                            data,
                            data.find(session => session.is_self)!.id
                        )
                    }
                >
                    <IconX />
                    Выйти со всех устройств
                </button>
            )}
        </>
    );
};

const SessionCard = ({ session }: { session: Session }) => {
    const { data } = useSWR('userSessions');

    let SessionIcon = IconDeviceDesktop;
    if (session.browser && session.is_mobile) SessionIcon = IconDeviceMobile;
    if (!session.browser) SessionIcon = IconServer;

    return (
        <div key={session.id} className={Style_safety.container}>
            <div className={Style_safety.session}>
                <h2 className={Style_safety.header}>
                    {<SessionIcon />}
                    {session.browser ?? 'Unknown'} {session.browser_version}{' '}
                    {session.is_self && <p>Это устройство</p>}
                </h2>
                <p
                    className={Style_safety.last_accessed}
                    title={formatDate(new Date(session.last_accessed))}
                >
                    Последний доступ{' '}
                    {timeStamp(new Date(session.last_accessed).getTime() / 1000)}
                </p>
            </div>
            {!session.is_self && (
                <button
                    className={Style_safety.button}
                    onClick={() => logoutSession(session.id, data)}
                >
                    <IconX />
                </button>
            )}
        </div>
    );
};
