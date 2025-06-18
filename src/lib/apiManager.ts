import * as Interfaces from '@/types/global.d';
import { authApi } from './api';
import axios, { AxiosResponse, GenericAbortSignal, Method } from 'axios';
import { SearchResponse } from '@/components/workshop/NickSearch';
import { SkinResponse } from '@/lib/bandageEngine';

type RequestProps = {
    url: string;
    method: Method;
    data?: unknown;
    params?: unknown;
    signal?: GenericAbortSignal;
};

type UpdateUsersProps = {
    banned?: boolean;
};

type SetStarResponse = { new_count: number; action_set: boolean };

/** Do HTTP request */
export const doRequest = async ({
    url,
    method,
    data,
    params
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
RequestProps): Promise<AxiosResponse<any, unknown>> => {
    const response = await authApi.request({
        url,
        method,
        data,
        params,
        headers: { 'accept-language': 'ru' }
    });
    if (response.status >= 400) throw response;

    return response;
};

/** Do HTTP simple */
export const doRequestSimple = async ({
    url,
    method,
    data,
    params,
    signal
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
RequestProps): Promise<AxiosResponse<any, unknown>> => {
    const response = await axios.request({
        url: process.env.NEXT_PUBLIC_API_URL.slice(0, -1) + url,
        method,
        data,
        params,
        headers: { 'accept-language': 'ru' },
        withCredentials: true,
        signal
    });
    if (response.status >= 400) throw response;

    return response;
};

export const loginDiscord = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/discord/${code}`,
            method: 'POST'
        })
    ).data;
};

export const loginMinecraft = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/minecraft/${code}`,
            method: 'POST'
        })
    ).data;
};

/** Get bandages under moderation */
export const getUnderModerationBandages = async (): Promise<
    Interfaces.Bandage[]
> => {
    return (
        await doRequest({
            url: `/workshop/moderation`,
            method: 'GET'
        })
    ).data as Interfaces.Bandage[];
};

/** Change bandage moderation status */
export const changeBandageModeration = async (
    id: string,
    body: {
        type: string;
        message: string;
        is_final: boolean;
        is_hides: boolean;
    }
): Promise<void> => {
    await doRequest({
        url: `/workshop/${id}/moderation`,
        method: 'PUT',
        data: body
    });
};

/** Get Categories */
export const getCategories = async (
    forEdit?: boolean
): Promise<Interfaces.Category[]> => {
    return (
        await doRequestSimple({
            url: '/workshop/categories',
            method: 'GET',
            params: { for_edit: forEdit ?? false }
        })
    ).data as Interfaces.Category[];
};

/** Get me profile */
export const getMe = async (): Promise<Interfaces.UserQuery> => {
    return (
        await doRequest({
            url: '/users/@me',
            method: 'GET'
        })
    ).data as Interfaces.UserQuery;
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
): Promise<Interfaces.UserAdmins> => {
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
    ).data as Interfaces.UserAdmins;
};

/** Update user */
export const updateUser = async (
    username: string,
    params: UpdateUsersProps
): Promise<void> => {
    await doRequest({
        url: `/users/${username}`,
        method: 'PATCH',
        data: params
    });
};

/** Force register user (admin) */
export const forceRegister = async (discord_id: string): Promise<void> => {
    await doRequest({
        url: `/users`,
        method: 'POST',
        data: { discord_id }
    });
};

/** Get me works */
export const getMeWorks = async (): Promise<Interfaces.Bandage[]> => {
    return (
        await doRequest({
            url: `/users/@me/works`,
            method: 'GET'
        })
    ).data as Interfaces.Bandage[];
};

/** Get me stars */
export const getMeStars = async (): Promise<Interfaces.Bandage[]> => {
    return (
        await doRequest({
            url: `/users/@me/stars`,
            method: 'GET'
        })
    ).data as Interfaces.Bandage[];
};

/** Set bandage star */
export const setStar = async (
    id: string,
    params: { set: boolean }
): Promise<SetStarResponse> => {
    return (
        await doRequest({
            url: `/workshop/star/${id}`,
            method: 'PUT',
            params
        })
    ).data as SetStarResponse;
};

/** Get me notifications */
export const getMeNotifications = async (params: {
    page: number;
}): Promise<Interfaces.INotifications> => {
    return (
        await doRequest({
            url: `/users/@me/notifications`,
            method: 'GET',
            params
        })
    ).data as Interfaces.INotifications;
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

/** Set public profile */
export const setPublicProfile = async (params: {
    state: boolean;
}): Promise<void> => {
    await doRequest({
        url: `/users/@me`,
        method: 'PATCH',
        data: { public: params.state }
    });
};

/** Set user profile theme */
export const setTheme = async (params: { theme: number }): Promise<void> => {
    await doRequest({
        url: `/users/@me`,
        method: 'PATCH',
        data: { theme: params.theme }
    });
};

/** Purge skin cache */
export const purgeSkinCache = async (): Promise<AxiosResponse> => {
    return await doRequest({
        url: `/users/@me/connections/minecraft/cache/purge`,
        method: 'POST'
    });
};

/** Disconnect minecraft profile */
export const disconnectMinecraft = async (): Promise<void> => {
    await doRequest({
        url: `/users/@me/connections/minecraft`,
        method: 'DELETE'
    });
};

/** Set minecraft profile visible */
export const setMinecraftVisible = async (params: {
    state: boolean;
}): Promise<boolean> => {
    return (
        await doRequest({
            url: `/users/@me`,
            method: 'PATCH',
            data: { nick_search: params.state }
        })
    ).data.new_data;
};

/** Set minecraft skin autoload */
export const setMinecraftAutoload = async (params: {
    state: boolean;
}): Promise<boolean> => {
    return (
        await doRequest({
            url: `/users/@me`,
            method: 'PATCH',
            data: { skin_autoload: params.state }
        })
    ).data.new_data;
};

/** Connect Minecraft Profile */
export const connectMinecraft = async (code: string): Promise<void> => {
    await doRequest({
        url: `/users/@me/connections/minecraft/connect/${code}`,
        method: 'POST'
    });
};

/** Search Minecraft nicks */
export const searchNicks = async (
    nickname: string,
    signal?: GenericAbortSignal
): Promise<SearchResponse> => {
    return (
        await doRequestSimple({
            url: `/minecraft/suggest`,
            params: {
                q: nickname
            },
            method: 'GET',
            signal
        })
    ).data;
};

/** Get Minecraft skin */
export const getSkin = async (nickname: string): Promise<SkinResponse> => {
    return (
        await doRequestSimple({
            url: `/minecraft/skin/${nickname}`,
            method: 'GET'
        })
    ).data;
};

/** Get sessions */
export const getSessions = async (): Promise<Interfaces.Session[]> => {
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

/** Update bandage */
export const updateBandage = async (
    id: string,
    data: {
        title: string;
        description: string;
        categories: number[];
        access_level: number;
        colorable: boolean;
    }
): Promise<void> => {
    await doRequest({
        url: `/workshop/${id}`,
        method: 'PUT',
        data
    });
};

/** Delete bandage */
export const deleteBandage = async (id: string): Promise<void> => {
    await doRequest({
        url: `/workshop/${id}`,
        method: 'DELETE'
    });
};

/** Archive bandage */
export const archiveBandage = async (id: string): Promise<void> => {
    await doRequest({
        url: `/workshop/${id}/archive`,
        method: 'PUT'
    });
};

/** Create bandage */
export const createBandage = async (data: {
    title: string;
    description: string;
    categories: number[];
    base64: string;
    base64_slim: string;
    split_type: boolean;
    colorable: boolean;
}): Promise<AxiosResponse> => {
    return await doRequest({
        url: `/workshop`,
        method: 'POST',
        data
    });
};

/** Get registration roles */
export const getRoles = async (): Promise<Interfaces.Role[]> => {
    return (
        await doRequestSimple({
            url: `/auth/roles`,
            method: 'GET'
        })
    ).data;
};

/** Get registration roles */
export const getWorkshop = async (params: {
    page: number;
    take: number;
    search: string;
    filters: string;
    sort: string;
}): Promise<Interfaces.BandageResponse> => {
    return (
        await doRequestSimple({
            url: `/workshop`,
            method: 'GET',
            params
        })
    ).data;
};
