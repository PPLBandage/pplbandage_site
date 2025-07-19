import { doRequest } from './utils';

/** Get me connections */
export const getMeConnections = async (): Promise<ConnectionsResponse> => {
    return (
        await doRequest({
            url: `/users/@me/connections`,
            method: 'GET'
        })
    ).data as ConnectionsResponse;
};

/** Connect Minecraft Profile */
export const connectMinecraft = async (code: string): Promise<void> => {
    await doRequest({
        url: `/users/@me/connections/minecraft/connect/${code}`,
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

/** Connect discord */
export const connectDiscord = async (code: string) => {
    return (
        await doRequest({
            url: `/users/@me/connections/discord`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

/** Disconnect discord */
export const disconnectDiscord = async () => {
    return (
        await doRequest({
            url: `/users/@me/connections/discord`,
            method: 'DELETE'
        })
    ).data;
};

/** Connect google */
export const connectGoogle = async (code: string) => {
    return (
        await doRequest({
            url: `/users/@me/connections/google`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

/** Disconnect google */
export const disconnectGoogle = async () => {
    return (
        await doRequest({
            url: `/users/@me/connections/google`,
            method: 'DELETE'
        })
    ).data;
};

/** Connect google */
export const connectTwitch = async (code: string) => {
    return (
        await doRequest({
            url: `/users/@me/connections/twitch`,
            method: 'POST',
            data: { code }
        })
    ).data;
};

/** Disconnect google */
export const disconnectTwitch = async () => {
    return (
        await doRequest({
            url: `/users/@me/connections/twitch`,
            method: 'DELETE'
        })
    ).data;
};
