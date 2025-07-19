import { useRouter } from 'next/navigation';
import { useState } from 'react';
import style from '@/styles/editor/page.module.css';
import * as Interfaces from '@/types/global.d';
import Select from 'react-select';
import { IconArchive, IconX } from '@tabler/icons-react';
import EditConfirmation from '@/components/workshop/EditConfirmation';
import Image from 'next/image';
import SlideButton from '@/components/SlideButton';
import TagSearch from './TagSearch';
import {
    updateBandage,
    deleteBandage as deleteBandageAPI,
    archiveBandage as archiveBandageAPI
} from '@/lib/api/workshop';

const lstrip = (string: string) => string.replace(/^\s+/, '');
const capitalize = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

export const access_level: { value: number; label: string }[] = [
    { value: 0, label: 'Ограниченный доступ' },
    { value: 1, label: 'Доступ только по ссылке' },
    { value: 2, label: 'Открытый доступ' }
];

const EditElement = ({
    bandage,
    onDone,
    onClose
}: {
    bandage: Interfaces.Bandage;
    onDone(): void;
    onClose(): void;
}) => {
    const router = useRouter();
    const [title, setTitle] = useState<string>(bandage.title);
    const [description, setDescription] = useState<string>(bandage.description);
    const [accessLevel, setAccessLevel] = useState<number>(undefined);
    const [tags, setTags] = useState<string[]>(bandage.tags);
    const [colorable, setColorable] = useState<boolean>(Boolean(bandage.flags & 1));

    const save = () => {
        updateBandage(bandage.external_id, {
            title: title,
            description: description || null,
            tags: tags,
            access_level: accessLevel,
            colorable
        })
            .then(onDone)
            .catch(response => {
                if (typeof response.data.message === 'object') {
                    alert(
                        response.data.message
                            .map((str: string) => capitalize(str))
                            .join('\n') || `Unhandled error: ${response.status}`
                    );
                } else {
                    alert(response.data.message);
                }
            });
    };

    const deleteBandage = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            deleteBandageAPI(bandage.external_id)
                .then(() => {
                    resolve();
                    router.replace('/workshop');
                })
                .catch(err => reject(err.data.message));
        });
    };

    const archiveBandage = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            archiveBandageAPI(bandage.external_id)
                .then(() => {
                    resolve();
                    window.location.reload();
                })
                .catch(err => reject(err.data.message));
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {bandage.permissions_level >= 2 ? (
                <>
                    <textarea
                        maxLength={50}
                        placeholder="Заголовок"
                        className={style.textarea}
                        onInput={ev =>
                            setTitle(
                                lstrip((ev.target as HTMLTextAreaElement).value)
                            )
                        }
                        value={title}
                    />
                    <textarea
                        maxLength={300}
                        placeholder="Описание"
                        className={style.textarea}
                        onInput={ev =>
                            setDescription(
                                lstrip((ev.target as HTMLTextAreaElement).value)
                            )
                        }
                        value={description ?? ''}
                    />
                </>
            ) : (
                <>
                    <h2 className={style.title}>{bandage.title}</h2>
                    {bandage.description && (
                        <p className={style.description} style={{ margin: 0 }}>
                            {bandage.description}
                        </p>
                    )}
                </>
            )}
            <SlideButton
                label="Окрашиваемая"
                value={colorable}
                onChange={setColorable}
            />
            <Select
                options={access_level}
                defaultValue={access_level[bandage.access_level]}
                className={`react-select-container`}
                classNamePrefix="react-select"
                isSearchable={false}
                instanceId="select-1"
                onChange={n => setAccessLevel(n.value)}
            />

            <p style={{ margin: 0, marginTop: '.5rem' }}>Выберите теги</p>
            <TagSearch defaultValue={bandage.tags} onChange={setTags} />

            <div className={style.check_notification}>
                <h3>Опасная зона</h3>
                <p>
                    Все действия в данной зоне имеют необратимый характер, делайте их
                    с умом!
                </p>

                <div className={style.delete_cont}>
                    <EditConfirmation
                        action="delete"
                        onInput={deleteBandage}
                        confirm_code={bandage.external_id}
                    >
                        <div className={style.deleteButton}>
                            <Image
                                className={style.binUp}
                                alt=""
                                src="/static/icons/bin_up.png"
                                width={24}
                                height={7}
                            />
                            <Image
                                className={style.binDown}
                                alt=""
                                src="/static/icons/bin_down.png"
                                width={24}
                                height={17}
                            />
                        </div>
                    </EditConfirmation>
                    <p style={{ margin: 0 }}>Удалить повязку</p>
                </div>
                <div className={style.archive_cont}>
                    <EditConfirmation
                        action="archive"
                        onInput={archiveBandage}
                        confirm_code={bandage.external_id}
                    >
                        <button className={style.archiveButton}>
                            <IconArchive />
                        </button>
                    </EditConfirmation>
                    <p style={{ margin: 0 }}>Архивировать</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
                <button
                    className={style.skin_load}
                    onClick={onClose}
                    style={{ padding: '.4rem', aspectRatio: 1 }}
                >
                    <IconX />
                </button>
                <button
                    className={style.skin_load}
                    onClick={save}
                    style={{ padding: '.4rem', width: '100%' }}
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default EditElement;
