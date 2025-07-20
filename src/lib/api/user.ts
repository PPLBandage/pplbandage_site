import type {
    Bandage,
    INotifications,
    Session,
    UserAdmins,
    UserQuery
} from '@/types/global';
import { doRequest } from './utils';

/** Get me profile */
export const getMe = async (): Promise<UserQuery> => {
    return (
        await doRequest({
            url: '/users/@me',
            method: 'GET'
        })
    ).data;
};

/** Log out */
export const logout = async (): Promise<void> => {
    await doRequest({
        url: '/users/@me',
        method: 'DELETE'
    });
};

/** Get users (admin) */
export const getUsers = async (
    page: number,
    take: number,
    query?: string
): Promise<UserAdmins> => {
    return (
        await doRequest({
            url: `/users`,
            params: {
                query,
                page,
                take
            },
            method: 'GET'
        })
    ).data;
};

/** Update user */
export const updateUser = async (
    username: string,
    params: {
        banned?: boolean;
    }
): Promise<void> => {
    await doRequest({
        url: `/users/${username}`,
        method: 'PATCH',
        data: params
    });
};

/** Get me works */
export const getMeWorks = async (): Promise<Bandage[]> => {
    return (
        await doRequest({
            url: `/users/@me/works`,
            method: 'GET'
        })
    ).data;
};

/** Get me stars */
export const getMeStars = async (): Promise<Bandage[]> => {
    return (
        await doRequest({
            url: `/users/@me/stars`,
            method: 'GET'
        })
    ).data;
};

/** Get me notifications */
export const getMeNotifications = async (params: {
    page: number;
}): Promise<INotifications> => {
    return (
        await doRequest({
            url: `/users/@me/notifications`,
            method: 'GET',
            params
        })
    ).data as INotifications;
};

/** Get me settings */
export const getMeSettings = async (): Promise<SettingsResponse> => {
    return (
        await doRequest({
            url: `/users/@me/settings`,
            method: 'GET'
        })
    ).data as SettingsResponse;
};

type UserSettings = {
    profile_theme?: number;
    minecraft_skin_autoload?: boolean;
    minecraft_nick_searchable?: boolean;
    public_profile?: boolean;
    preferred_avatar?: string;
};

/** Set user settings */
export const setUserSetting = async (params: UserSettings): Promise<void> => {
    await doRequest({
        url: `/users/@me`,
        method: 'PATCH',
        data: params
    });
};

/** Get sessions */
export const getSessions = async (): Promise<Session[]> => {
    return (
        await doRequest({
            url: `/users/@me/sessions`,
            method: 'GET'
        })
    ).data;
};

/** Logout from session */
export const logoutSession = async (session: number): Promise<void> => {
    await doRequest({
        url: `/users/@me/sessions/${session}`,
        method: 'DELETE'
    });
};

/** Logout from all sessions */
export const logoutAllSessions = async (): Promise<void> => {
    await doRequest({
        url: `/users/@me/sessions/all`,
        method: 'DELETE'
    });
};

/** Subscribe to user */
export const subscribeTo = async (username: string): Promise<number> => {
    return (
        await doRequest({
            url: `/users/${username}/subscribers`,
            method: 'POST'
        })
    ).data.count;
};

/** Unsubscribe to user */
export const unsubscribeFrom = async (username: string): Promise<number> => {
    return (
        await doRequest({
            url: `/users/${username}/subscribers`,
            method: 'DELETE'
        })
    ).data.count;
};
