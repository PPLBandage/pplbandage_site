import CategorySelector from '@/app/modules/components/CategorySelector';
import ApiManager from '@/app/modules/utils/apiManager';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import style from '@/app/styles/editor/page.module.css';
import * as Interfaces from '@/app/interfaces';
import Select from 'react-select';
import { IconArchive, IconX } from '@tabler/icons-react';
import EditConfirmation from '@/app/modules/components/EditConfirmation';

const lstrip = (string: string) => string.replace(/^\s+/, '');

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
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>(
        []
    );
    const [categories, setCategories] = useState<number[]>(undefined);
    const [accessLevel, setAccessLevel] = useState<number>(undefined);

    useEffect(() => {
        ApiManager.getCategories(true)
            .then(setAllCategories)
            .catch(console.error);
    }, []);

    function capitalize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const save = () => {
        ApiManager.updateBandage(bandage.external_id, {
            title: title,
            description: description || null,
            categories: categories,
            access_level: accessLevel
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
            ApiManager.deleteBandage(bandage.external_id)
                .then(() => {
                    resolve();
                    router.replace('/workshop');
                })
                .catch(err => reject(err.data.message));
        });
    };

    const archiveBandage = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.archiveBandage(bandage.external_id)
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
                        value={description}
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
            <CategorySelector
                enabledCategories={bandage.categories}
                allCategories={allCategories}
                onChange={setCategories}
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
            <div
                className={style.check_notification}
                style={{
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, .13)',
                    margin: 0
                }}
            >
                <h3>Опасная зона</h3>
                <p>
                    Все действия в данной зоне имеют необратимый характер,
                    делайте их с умом!
                </p>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '.4rem',
                        marginTop: '1rem',
                        marginBottom: '.4rem'
                    }}
                >
                    <EditConfirmation
                        action="delete"
                        onInput={deleteBandage}
                        confirm_code={bandage.external_id}
                    >
                        <div className={style.deleteButton}>
                            <img
                                className={style.binUp}
                                alt=""
                                src="/static/icons/bin_up.png"
                            ></img>
                            <img
                                className={style.binDown}
                                alt=""
                                src="/static/icons/bin_down.png"
                            ></img>
                        </div>
                    </EditConfirmation>
                    <p style={{ margin: 0 }}>Удалить повязку</p>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.4rem'
                    }}
                >
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
