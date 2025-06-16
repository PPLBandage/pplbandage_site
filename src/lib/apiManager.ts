import * as Interfaces from '@/types/global.d';
import { authApi } from './api';
import axios, { AxiosResponse, GenericAbortSignal, Method } from 'axios';
import { SearchResponse } from '@/components/workshop/NickSearch';
import { SkinResponse } from '@/lib/bandage_engine';

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

/*
    Этот класс следует переделать, так как он подгружается целиком в бандл,
    что увеличивает размер последнего.
*/
class ApiManager {
    /** Do HTTP request */
    private static async doRequest({
        url,
        method,
        data,
        params
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RequestProps): Promise<AxiosResponse<any, unknown>> {
        const response = await authApi.request({
            url,
            method,
            data,
            params,
            headers: { 'accept-language': 'ru' }
        });
        if (response.status >= 400) throw response;

        return response;
    }

    /** Do HTTP simple */
    private static async doRequestSimple({
        url,
        method,
        data,
        params,
        signal
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RequestProps): Promise<AxiosResponse<any, unknown>> {
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
    }

    static async loginDiscord(code: string) {
        return (
            await this.doRequest({
                url: `/auth/discord/${code}`,
                method: 'POST'
            })
        ).data;
    }

    static async loginMinecraft(code: string) {
        return (
            await this.doRequest({
                url: `/auth/minecraft/${code}`,
                method: 'POST'
            })
        ).data;
    }

    /** Get Categories */
    static async getCategories(
        forEdit?: boolean
    ): Promise<Interfaces.Category[]> {
        return (
            await this.doRequestSimple({
                url: '/workshop/categories',
                method: 'GET',
                params: { for_edit: forEdit ?? false }
            })
        ).data as Interfaces.Category[];
    }

    /** Get me profile */
    static async getMe(): Promise<Interfaces.UserQuery> {
        return (
            await this.doRequest({
                url: '/users/@me',
                method: 'GET'
            })
        ).data as Interfaces.UserQuery;
    }

    /** Log out */
    static async logout(): Promise<void> {
        await this.doRequest({
            url: '/users/@me',
            method: 'DELETE'
        });
    }

    /** Get users (admin) */
    static async getUsers(
        page: number,
        take: number,
        query?: string
    ): Promise<Interfaces.UserAdmins> {
        return (
            await this.doRequest({
                url: `/users`,
                params: {
                    query,
                    page,
                    take
                },
                method: 'GET'
            })
        ).data as Interfaces.UserAdmins;
    }

    /** Update user */
    static async updateUser(
        username: string,
        params: UpdateUsersProps
    ): Promise<void> {
        await this.doRequest({
            url: `/users/${username}`,
            method: 'PATCH',
            data: params
        });
    }

    /** Force register user (admin) */
    static async forceRegister(discord_id: string): Promise<void> {
        await this.doRequest({
            url: `/users`,
            method: 'POST',
            data: { discord_id }
        });
    }

    /** Get me works */
    static async getMeWorks(): Promise<Interfaces.Bandage[]> {
        return (
            await this.doRequest({
                url: `/users/@me/works`,
                method: 'GET'
            })
        ).data as Interfaces.Bandage[];
    }

    /** Get me stars */
    static async getMeStars(): Promise<Interfaces.Bandage[]> {
        return (
            await this.doRequest({
                url: `/users/@me/stars`,
                method: 'GET'
            })
        ).data as Interfaces.Bandage[];
    }

    /** Set bandage star */
    static async setStar(
        id: string,
        params: { set: boolean }
    ): Promise<SetStarResponse> {
        return (
            await this.doRequest({
                url: `/workshop/star/${id}`,
                method: 'PUT',
                params
            })
        ).data as SetStarResponse;
    }

    /** Get me notifications */
    static async getMeNotifications(params: {
        page: number;
    }): Promise<Interfaces.INotifications> {
        return (
            await this.doRequest({
                url: `/users/@me/notifications`,
                method: 'GET',
                params
            })
        ).data as Interfaces.INotifications;
    }

    /** Get me settings */
    static async getMeSettings(): Promise<SettingsResponse> {
        return (
            await this.doRequest({
                url: `/users/@me/settings`,
                method: 'GET'
            })
        ).data as SettingsResponse;
    }

    /** Set public profile */
    static async setPublicProfile(params: { state: boolean }): Promise<void> {
        await this.doRequest({
            url: `/users/@me`,
            method: 'PATCH',
            data: { public: params.state }
        });
    }

    /** Set user profile theme */
    static async setTheme(params: { theme: number }): Promise<void> {
        await this.doRequest({
            url: `/users/@me`,
            method: 'PATCH',
            data: { theme: params.theme }
        });
    }

    /** Purge skin cache */
    static async purgeSkinCache(): Promise<AxiosResponse> {
        return await this.doRequest({
            url: `/users/@me/connections/minecraft/cache/purge`,
            method: 'POST'
        });
    }

    /** Disconnect minecraft profile */
    static async disconnectMinecraft(): Promise<void> {
        await this.doRequest({
            url: `/users/@me/connections/minecraft`,
            method: 'DELETE'
        });
    }

    /** Set minecraft profile visible */
    static async setMinecraftVisible(params: {
        state: boolean;
    }): Promise<boolean> {
        return (
            await this.doRequest({
                url: `/users/@me`,
                method: 'PATCH',
                data: { nick_search: params.state }
            })
        ).data.new_data;
    }

    /** Set minecraft skin autoload */
    static async setMinecraftAutoload(params: {
        state: boolean;
    }): Promise<boolean> {
        return (
            await this.doRequest({
                url: `/users/@me`,
                method: 'PATCH',
                data: { skin_autoload: params.state }
            })
        ).data.new_data;
    }

    /** Connect Minecraft Profile */
    static async connectMinecraft(code: string): Promise<void> {
        await this.doRequest({
            url: `/users/@me/connections/minecraft/connect/${code}`,
            method: 'POST'
        });
    }

    /** Search Minecraft nicks */
    static async searchNicks(
        nickname: string,
        signal?: GenericAbortSignal
    ): Promise<SearchResponse> {
        return (
            await this.doRequestSimple({
                url: `/minecraft/suggest`,
                params: {
                    q: nickname
                },
                method: 'GET',
                signal
            })
        ).data;
    }

    /** Get Minecraft skin */
    static async getSkin(nickname: string): Promise<SkinResponse> {
        return (
            await this.doRequestSimple({
                url: `/minecraft/skin/${nickname}`,
                method: 'GET'
            })
        ).data;
    }

    /** Get sessions */
    static async getSessions(): Promise<Interfaces.Session[]> {
        return (
            await this.doRequest({
                url: `/users/@me/sessions`,
                method: 'GET'
            })
        ).data;
    }

    /** Logout from session */
    static async logoutSession(session: number): Promise<void> {
        await this.doRequest({
            url: `/users/@me/sessions/${session}`,
            method: 'DELETE'
        });
    }

    /** Logout from all sessions */
    static async logoutAllSessions(): Promise<void> {
        await this.doRequest({
            url: `/users/@me/sessions/all`,
            method: 'DELETE'
        });
    }

    /** Update bandage */
    static async updateBandage(
        id: string,
        data: {
            title: string;
            description: string;
            categories: number[];
            access_level: number;
            colorable: boolean;
        }
    ): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}`,
            method: 'PUT',
            data
        });
    }

    /** Delete bandage */
    static async deleteBandage(id: string): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}`,
            method: 'DELETE'
        });
    }

    /** Archive bandage */
    static async archiveBandage(id: string): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}/archive`,
            method: 'PUT'
        });
    }

    /** Create bandage */
    static async createBandage(data: {
        title: string;
        description: string;
        categories: number[];
        base64: string;
        base64_slim: string;
        split_type: boolean;
        colorable: boolean;
    }): Promise<AxiosResponse> {
        return await this.doRequest({
            url: `/workshop`,
            method: 'POST',
            data
        });
    }

    /** Get registration roles */
    static async getRoles(): Promise<Interfaces.Role[]> {
        return (
            await this.doRequestSimple({
                url: `/auth/roles`,
                method: 'GET'
            })
        ).data;
    }

    /** Get registration roles */
    static async getWorkshop(params: {
        page: number;
        take: number;
        search: string;
        filters: string;
        sort: string;
    }): Promise<Interfaces.BandageResponse> {
        return (
            await this.doRequestSimple({
                url: `/workshop`,
                method: 'GET',
                params
            })
        ).data;
    }
}

export default ApiManager;
