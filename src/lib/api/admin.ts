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

export type EventType = {
    id: number;
    name: string;
    start: string;
    end: string;
    boost_amount: number;
    tags: string[];
};

/** Get all events */
export const getEvents = async (): Promise<EventType[]> => {
    return (
        await doRequest({
            url: '/admin/events',
            method: 'GET'
        })
    ).data;
};

type UpdateEvent = {
    id?: number;
    name: string;
    start_date: string;
    end_date: string;
    tags: string[];
    boost_amount: number;
};

export const updateEvent = async (data: UpdateEvent): Promise<void> => {
    return (
        await doRequest({
            url: '/admin/events',
            method: 'PUT',
            data
        })
    ).data;
};

export const createEvent = async (data: Omit<UpdateEvent, 'id'>): Promise<void> => {
    return (
        await doRequest({
            url: '/admin/events',
            method: 'POST',
            data
        })
    ).data;
};

export const deleteEvent = async (data: { id: number }): Promise<void> => {
    return (
        await doRequest({
            url: '/admin/events',
            method: 'DELETE',
            data
        })
    ).data;
};
