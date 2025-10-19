import { doRequest } from './utils';

export type KvRecordType = Record<
    string,
    { id: number; value: string; modified: Date; created: Date }
>;

/** Get all KV records */
export const getKv = async (): Promise<KvRecordType> => {
    return (
        await doRequest({
            url: '/admin/kv',
            method: 'GET'
        })
    ).data;
};

/** Set KV record */
export const setKv = async (key: string, value: string): Promise<void> => {
    await doRequest({
        url: '/admin/kv',
        method: 'POST',
        data: { key, value }
    });
};

/** Delete KV record */
export const deleteKv = async (key: string): Promise<void> => {
    await doRequest({
        url: '/admin/kv',
        method: 'DELETE',
        data: { key }
    });
};
