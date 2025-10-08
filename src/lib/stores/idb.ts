import { openDB } from 'idb';

async function getDB(store_name: string) {
    return openDB('pplbandage-store', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(store_name)) {
                db.createObjectStore(store_name);
            }
        }
    });
}

export async function idbSet(store_name: string, key: string, value: string) {
    const db = await getDB(store_name);
    await db.put(store_name, value, key);
}

export async function idbGet(store_name: string, key: string) {
    const db = await getDB(store_name);
    const value = await db.get(store_name, key);
    return value;
}
