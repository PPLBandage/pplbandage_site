import axios, { AxiosResponse, GenericAbortSignal, Method } from 'axios';
import { authApi } from './api';

type RequestProps = {
    url: string;
    method: Method;
    data?: unknown;
    params?: unknown;
    signal?: GenericAbortSignal;
};

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
        url: process.env.NEXT_PUBLIC_API_URL!.slice(0, -1) + url,
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
