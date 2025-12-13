import { AxiosResponse, GenericAbortSignal } from 'axios';
import { doRequest, doRequestSimple } from './utils';
import type { SearchResponse } from '@/components/workshop/NickSearch';
import type { SkinResponse } from '@/lib/workshop/bandageEngine';

/** Purge skin cache */
export const purgeSkinCache = async (): Promise<AxiosResponse> => {
    return await doRequest({
        url: `/users/@me/connections/minecraft/cache/purge`,
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
