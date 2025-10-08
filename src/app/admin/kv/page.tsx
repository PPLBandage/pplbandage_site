'use client';

import useAccess from '@/lib/useAccess';
import { notFound } from 'next/navigation';
import style_root from '@/styles/admin/page.module.css';
import style from '@/styles/admin/kv.module.css';
import useSWR, { mutate } from 'swr';
import { deleteKv, getKv, KvRecordType, setKv } from '@/lib/api/admin';
import { formatDate } from '@/lib/time';
import { useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

const Tr = (props: { key_: string; data: KvRecordType[keyof KvRecordType] }) => {
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [key, setKey] = useState<string>(props.key_);
    const [value, setValue] = useState<string>(props.data.value);

    const save = () => {
        setKv(key, value)
            .then(() => {
                mutate('kv-list');
                setIsDirty(false);
            })
            .catch(console.error);
    };

    const deleteKvCallback = () => {
        if (!confirm('Удалить?')) return;

        deleteKv(key)
            .then(() => mutate('kv-list'))
            .catch(console.error);
    };

    return (
        <tr>
            <th scope="row">{props.data.id}</th>
            <td className={style.td_with_input}>
                <input
                    value={key}
                    onChange={e => {
                        setKey(e.target.value);
                        setIsDirty(true);
                    }}
                    type="text"
                    name="key"
                />
            </td>
            <td className={style.td_with_input}>
                <input
                    value={value}
                    onChange={e => {
                        setValue(e.target.value);
                        setIsDirty(true);
                    }}
                    type="text"
                    name="value"
                />
            </td>
            <td>{formatDate(new Date(props.data.modified))}</td>
            <td>{formatDate(new Date(props.data.created))}</td>

            <td>
                <button
                    disabled={!isDirty}
                    className={style.td_button}
                    onClick={save}
                >
                    <IconDeviceFloppy />
                </button>
            </td>

            <td>
                <button className={style.td_button} onClick={deleteKvCallback}>
                    <IconTrash />
                </button>
            </td>
        </tr>
    );
};

const CreateTr = () => {
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [key, setKey] = useState<string>('');
    const [value, setValue] = useState<string>('');

    const save = () => {
        setKv(key, value)
            .then(() => {
                mutate('kv-list');
                setIsDirty(false);
                setKey('');
                setValue('');
            })
            .catch(console.error);
    };

    return (
        <tr>
            <th scope="row"></th>
            <td className={style.td_with_input}>
                <input
                    value={key}
                    onChange={e => {
                        setKey(e.target.value);
                        setIsDirty(true);
                    }}
                    type="text"
                    name="key"
                    placeholder="Key"
                />
            </td>
            <td className={style.td_with_input}>
                <input
                    value={value}
                    onChange={e => {
                        setValue(e.target.value);
                        setIsDirty(true);
                    }}
                    type="text"
                    name="value"
                    placeholder="Value"
                />
            </td>
            <td></td>
            <td></td>

            <td>
                <button
                    disabled={!isDirty}
                    className={style.td_button}
                    onClick={save}
                >
                    <IconDeviceFloppy />
                </button>
            </td>

            <td></td>
        </tr>
    );
};

const KV = () => {
    const { data } = useSWR('kv-list', async () => await getKv());
    if (!data) return null;

    const elements = Object.entries(data).map(([key, data], id) => (
        <Tr key={id} key_={key} data={data} />
    ));

    return (
        <div>
            <h2 style={{ margin: 0 }}>KV База данных</h2>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Key</th>
                        <th scope="col">Value</th>
                        <th scope="col">Modified</th>
                        <th scope="col">Created</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {elements}
                    <CreateTr />
                </tbody>
            </table>
        </div>
    );
};

const Page = () => {
    const access = useAccess();
    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    if (!superAdmin) {
        notFound();
    }

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                <KV />
            </div>
        </main>
    );
};

export default Page;
