import type { Bandage, BandageResponse } from '@/types/global';
import { doRequest, doRequestSimple } from './utils';
import { AxiosResponse, GenericAbortSignal } from 'axios';

/** Get workshop */
export const getWorkshop = async (params: {
    page: number;
    take: number;
    search: string;
    sort: string;
}): Promise<BandageResponse> => {
    return (
        await doRequestSimple({
            url: `/workshop`,
            method: 'GET',
            params
        })
    ).data;
};

/** Get bandages under moderation */
export const getUnderModerationBandages = async (): Promise<Bandage[]> => {
    return (
        await doRequest({
            url: `/workshop/moderation`,
            method: 'GET'
        })
    ).data as Bandage[];
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

/** Get Tags Suggestions */
export const getTagsSuggestions = async (
    q: string,
    signal: GenericAbortSignal
): Promise<string[]> => {
    return (
        await doRequestSimple({
            url: '/workshop/tags/suggest',
            method: 'GET',
            params: { q: q },
            signal
        })
    ).data;
};

/** Set bandage star */
export const setStar = async (
    id: string,
    params: { set: boolean }
): Promise<{ new_count: number; action_set: boolean }> => {
    return (
        await doRequest({
            url: `/workshop/star/${id}`,
            method: 'PUT',
            params
        })
    ).data;
};

/** Update bandage */
export const updateBandage = async (
    id: string,
    data: {
        title: string;
        description: string;
        tags: string[];
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
    tags: string[];
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
