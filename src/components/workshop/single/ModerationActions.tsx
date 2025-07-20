'use client';

import useAccess from '@/lib/useAccess';
import { useState } from 'react';
import style from '@/styles/workshop/moderationActions.module.css';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import Select from 'react-select';
import SlideButton from '@/components/SlideButton';
import { Bandage } from '@/types/global';
import { changeBandageModeration } from '@/lib/api/workshop';

const ModeratorActions = ({ data }: { data: Bandage }) => {
    const access = useAccess();
    const [expanded, setExpanded] = useState<boolean>(false);

    if (!access.includes(5) && !access.includes(1)) {
        return null;
    }

    if (!expanded) {
        return (
            <div className={style.centering}>
                <button
                    className={style.button}
                    style={{ marginBottom: '1rem' }}
                    onClick={() => setExpanded(true)}
                >
                    Открыть панель модератора
                </button>
            </div>
        );
    }

    return (
        <div className={`${style.main_container} ${style.centering}`}>
            <Moderation data={data} />
            <button
                className={style.button}
                style={{ marginTop: '.8rem' }}
                onClick={() => setExpanded(false)}
            >
                Закрыть без сохранения
            </button>
        </div>
    );
};

type ActionsType = {
    label: string;
    value: string;
    need_message: boolean;
    is_hides: boolean;
};
const actions: ActionsType[] = [
    { label: 'Одобрить', value: 'none', need_message: false, is_hides: false },
    { label: 'Отклонить', value: 'denied', need_message: true, is_hides: true },
    {
        label: 'Отправить на модерацию',
        value: 'review',
        need_message: true,
        is_hides: true
    },
    {
        label: 'Доп. информация',
        value: 'info',
        need_message: true,
        is_hides: false
    }
];

const Moderation = ({ data }: { data: Bandage }) => {
    const [action, setAction] = useState<ActionsType | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isAppealable, setIsAppealable] = useState<boolean>(true);

    const onSave = () => {
        if (!action) {
            return;
        }
        changeBandageModeration(data.external_id, {
            type: action.value,
            message: message,
            is_final: !isAppealable,
            is_hides: action.is_hides
        })
            .then(() => window.location.reload())
            .catch(() => alert('Не удалось изменить состояние модерации'));
    };

    const need_message = action?.need_message ?? false;
    return (
        <div className={style.container}>
            <h3 className={style.header}>
                <IconRosetteDiscountCheck /> Модерация
            </h3>
            <p className={style.hl2}>Действие</p>
            <Select
                options={actions}
                className={`react-select-container`}
                classNamePrefix="react-select"
                instanceId="select-69"
                onChange={setAction}
            />

            {need_message && (
                <>
                    <p className={style.hl2}>Сообщение</p>
                    <textarea
                        maxLength={200}
                        id="message"
                        placeholder="Сообщение"
                        className={style.textarea}
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                    />
                </>
            )}
            <SlideButton
                label="Можно обжаловать"
                onChange={setIsAppealable}
                defaultValue={true}
            />

            <button className={style.button} onClick={onSave}>
                Сохранить
            </button>
        </div>
    );
};

export default ModeratorActions;
