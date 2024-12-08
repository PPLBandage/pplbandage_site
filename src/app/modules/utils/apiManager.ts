import * as Interfaces from "@/app/interfaces";
import { authApi } from "./api";
import axios, { AxiosResponse, Method } from "axios";
import { Query } from "../components/Header";
import { SettingsResponse } from "@/app/me/settings/page";
import { SearchResponse } from "../components/NickSearch";

type RequestProps = {
    url: string,
    method: Method,
    data?: any,
    params?: any
};

type UpdateUsersProps = {
    banned?: boolean
}

class ApiManager {

    /* Do HTTP request */
    private static async doRequest({
        url,
        method,
        data,
        params }: RequestProps): Promise<AxiosResponse<any, any>> {
        const response = await authApi.request({ url, method, data, params });
        if (response.status >= 400)
            throw response;

        return response;
    }

    /* Do HTTP simple */
    private static async doRequestSimple({
        url,
        method,
        data,
        params
    }: RequestProps): Promise<AxiosResponse<any, any>> {
        const response = await axios.request({
            url: process.env.NEXT_PUBLIC_API_URL.slice(0, -1) + url,
            method,
            data,
            params,
            withCredentials: true
        });
        if (response.status >= 400)
            throw response;

        return response;
    }


    /* Get Categories */
    static async getCategories(forEdit?: boolean): Promise<Interfaces.Category[]> {
        return (await this.doRequestSimple({
            url: '/categories',
            method: 'GET',
            params: { for_edit: forEdit ?? false }
        })).data;
    }

    /* Get me profile */
    static async getMe(): Promise<Query> {
        return (await this.doRequest({
            url: '/user/me',
            method: 'GET'
        })).data;
    }

    /* Log out */
    static async logout(): Promise<void> {
        await this.doRequest({
            url: '/user/me',
            method: 'DELETE'
        });
    }

    /* Get users (admin) */
    static async getUsers(): Promise<Interfaces.UserAdmins[]> {
        return (await this.doRequest({
            url: '/users',
            method: 'GET'
        })).data;
    }

    /* Update user */
    static async updateUser(username: string, params: UpdateUsersProps): Promise<void> {
        await this.doRequest({
            url: `/users/${username}`,
            method: 'PUT',
            data: params
        });
    }

    /* Get me works */
    static async getMeWorks(): Promise<Interfaces.Bandage[]> {
        return (await this.doRequest({
            url: `/user/me/works`,
            method: 'GET'
        })).data;
    }


    /* Get me stars */
    static async getMeStars(): Promise<Interfaces.Bandage[]> {
        return (await this.doRequest({
            url: `/user/me/stars`,
            method: 'GET'
        })).data;
    }

    /* Set bandage star */
    static async setStar(id: string, params: { set: boolean }): Promise<{ new_count: number, action_set: boolean }> {
        return (await this.doRequest({
            url: `/star/${id}`,
            method: 'PUT',
            params
        })).data;
    }

    /* Get me notifications */
    static async getMeNotifications(params: { page: number }): Promise<Interfaces.NotificationsInterface> {
        return (await this.doRequest({
            url: `/user/me/notifications`,
            method: 'GET',
            params
        })).data;
    }

    /* Get me settings */
    static async getMeSettings(): Promise<SettingsResponse> {
        return (await this.doRequest({
            url: `/user/me/settings`,
            method: 'GET'
        })).data;
    }

    /* Set public profile */
    static async setPublicProfile(params: { state: boolean }): Promise<boolean> {
        return (await this.doRequest({
            url: `/user/me/settings/public`,
            method: 'PUT',
            params
        })).data.new_data;
    }

    /* Set user profile theme */
    static async setTheme(params: { theme: number }): Promise<void> {
        await this.doRequest({
            url: `/user/me/theme`,
            method: 'PUT',
            data: params
        });
    }

    /* Purge skin cache */
    static async purgeSkinCache(): Promise<AxiosResponse> {
        return (await this.doRequest({
            url: `/user/me/connections/minecraft/cache/purge`,
            method: 'POST'
        }));
    }

    /* Disconnect minecraft profile */
    static async disconnectMinecraft(): Promise<void> {
        await this.doRequest({
            url: `/user/me/connections/minecraft`,
            method: 'DELETE'
        });
    }

    /* Set minecraft profile visible */
    static async setMinecraftVisible(params: { state: boolean }): Promise<boolean> {
        return (await this.doRequest({
            url: `/user/me/connections/minecraft/valid`,
            method: 'PUT',
            params
        })).data.new_data;
    }

    /* Set minecraft skin autoload */
    static async setMinecraftAutoload(params: { state: boolean }): Promise<boolean> {
        return (await this.doRequest({
            url: `/user/me/connections/minecraft/autoload`,
            method: 'PUT',
            params
        })).data.new_data;
    }

    /* Connect Minecraft Profile */
    static async connectMinecraft(code: string): Promise<void> {
        await this.doRequest({
            url: `/user/me/connections/minecraft/connect/${code}`,
            method: 'POST'
        });
    }

    /* Search Minecraft nicks */
    static async searchNicks(nickname: string): Promise<SearchResponse> {
        return (await this.doRequestSimple({
            url: `/minecraft/search/${nickname}`,
            method: 'GET'
        })).data;
    }

    /* Get Minecraft skin */
    static async getSkin(nickname: string): Promise<AxiosResponse> {
        return (await this.doRequestSimple({
            url: `/minecraft/skin/${nickname}?cape=true`,
            method: 'GET'
        }));
    }

    /* Get sessions */
    static async getSessions(): Promise<Interfaces.Session[]> {
        return (await this.doRequest({
            url: `/user/me/sessions`,
            method: 'GET'
        })).data;
    }

    /* Logout from session */
    static async logoutSession(session: number): Promise<void> {
        await this.doRequest({
            url: `/user/me/sessions/${session}`,
            method: 'DELETE'
        });
    }

    /* Logout from all sessions */
    static async logoutAllSessions(): Promise<void> {
        await this.doRequest({
            url: `/user/me/sessions/all`,
            method: 'DELETE'
        });
    }



    /* Update bandage */
    static async updateBandage(
        id: string,
        data: {
            title: string,
            description: string,
            categories: number[],
            access_level: number
        }
    ): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}`,
            method: 'PUT',
            data
        });
    }

    /* Delete bandage */
    static async deleteBandage(id: string): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}`,
            method: 'DELETE'
        });
    }

    /* Archive bandage */
    static async archiveBandage(id: string): Promise<void> {
        await this.doRequest({
            url: `/workshop/${id}/archive`,
            method: 'PUT'
        });
    }

    /* Create bandage */
    static async createBandage(
        data: {
            title: string,
            description: string,
            categories: number[],
            base64: string,
            base64_slim: string,
            split_type: boolean
        }
    ): Promise<AxiosResponse> {
        return await this.doRequest({
            url: `/workshop`,
            method: 'POST',
            data
        });
    }


    /* Get registration roles */
    static async getRoles(): Promise<Interfaces.Role[]> {
        return (await this.doRequestSimple({
            url: `/auth/roles`,
            method: 'GET'
        })).data;
    }

    /* Get registration roles */
    static async getWorkshop(
        params: {
            page: number,
            take: number,
            search: string,
            filters: string,
            sort: string
        }
    ): Promise<Interfaces.BandageResponse> {
        return (await this.doRequestSimple({
            url: `/workshop`,
            method: 'GET',
            params
        })).data;
    }
}

export default ApiManager;