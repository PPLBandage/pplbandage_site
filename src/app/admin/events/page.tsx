'use client';

import useAccess from '@/lib/useAccess';
import { notFound } from 'next/navigation';
import style_root from '@/styles/admin/page.module.css';
import useSWR, { mutate } from 'swr';
import styles from '@/styles/admin/events.module.css';
import {
    EventType,
    getEvents,
    updateEvent as updateEventAPI,
    createEvent as createEventAPI,
    deleteEvent as deleteEventAPI
} from '@/lib/api/admin';
import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import TagSearch from '@/components/workshop/TagSearch';

const convertDateTime = (iso: string) => {
    const date = new Date(iso);
    const offset = -3 * 60;
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

const convertDateTimeToIso = (iso: string) => {
    const date = new Date(iso);
    return date.toISOString();
};

const EventCard = (data: EventType & { new?: boolean }) => {
    const [start, setStart] = useState<string>(convertDateTime(data.start));
    const [end, setEnd] = useState<string>(convertDateTime(data.end));
    const [name, setName] = useState<string>(data.name);
    const [boost, setBoost] = useState<number>(data.boost_amount);
    const [tags, setTags] = useState<string[]>(data.tags);

    const updateEvent = () => {
        updateEventAPI({
            id: data.id as number,
            name,
            start_date: convertDateTimeToIso(start),
            end_date: convertDateTimeToIso(end),
            boost_amount: boost,
            tags: tags
        })
            .then(() => {
                mutate('events-list');
            })
            .catch(err => alert(err.data.message));
    };

    const createEvent = () => {
        createEventAPI({
            name,
            start_date: convertDateTimeToIso(start),
            end_date: convertDateTimeToIso(end),
            boost_amount: boost,
            tags: tags
        })
            .then(() => {
                mutate('events-list');
            })
            .catch(err => alert(err.data.message));
    };

    const deleteEvent = () => {
        if (!confirm('Удалить?')) return;
        deleteEventAPI({ id: data.id })
            .then(() => {
                mutate('events-list');
            })
            .catch(err => alert(err.data.message));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{data.new ? 'Новый ивент' : data.id}</h3>
                {!data.new && <IconTrash onClick={deleteEvent} />}
            </div>
            <div className={styles.card_children}>
                <span>Название ивента</span>
                <input value={name} onChange={evt => setName(evt.target.value)} />
            </div>

            <div className={styles.card_children}>
                <span>Придаваемый буст (эквивалент звезд)</span>
                <input
                    value={boost}
                    onChange={evt => setBoost(Number(evt.target.value))}
                    type="number"
                />
            </div>
            <div className={styles.card_children}>
                <span>Период действия</span>
                <span style={{ fontSize: '.9rem', marginTop: '.5rem' }}>
                    C (МСК):
                </span>
                <input
                    value={start}
                    max={end}
                    onChange={evt => setStart(evt.target.value)}
                    type="datetime-local"
                />
                <span style={{ fontSize: '.9rem', marginTop: '.5rem' }}>
                    По (МСК):
                </span>
                <input
                    value={end}
                    min={start}
                    onChange={evt => setEnd(evt.target.value)}
                    type="datetime-local"
                />
            </div>
            <div className={styles.card_children}>
                <span>Затрагиваемые теги</span>
                <TagSearch defaultValue={tags} onChange={tags => setTags(tags)} />
            </div>

            <button
                className={styles.save_btn}
                onClick={() => {
                    if (data.new) createEvent();
                    else updateEvent();
                }}
            >
                Сохранить
            </button>
        </div>
    );
};

const Events = () => {
    const { data } = useSWR('events-list', async () => await getEvents());
    if (!data) return null;

    const events = data.map((evt, i) => <EventCard key={i} {...evt} />);
    return (
        <div className={styles.main_container}>
            {events}
            <EventCard
                id={0}
                name={''}
                start={new Date().toISOString()}
                end={new Date().toISOString()}
                boost_amount={0}
                tags={[]}
                new
            />
        </div>
    );
};

const Page = () => {
    const access = useAccess();
    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    if (!superAdmin && !access.includes(7)) {
        notFound();
    }

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                <Events />
            </div>
        </main>
    );
};

export default Page;
