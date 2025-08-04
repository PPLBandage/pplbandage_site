import { doRequest } from './utils';

export const loginDiscord = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/discord`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

export const loginMinecraft = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/minecraft`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

export const loginGoogle = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/google`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

export const loginTwitch = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/twitch`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

export const loginTelegram = async (code: string) => {
    return (
        await doRequest({
            url: `/auth/telegram`,
            method: 'POST',
            data: { code }
        })
    ).data;
};
