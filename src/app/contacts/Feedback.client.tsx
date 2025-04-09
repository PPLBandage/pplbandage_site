'use client';

import style from '@/app/styles/contacts/feedback.module.css';
import { IconSend } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useNextCookie } from 'use-next-cookie';
import { stringTimeDelta } from '../modules/utils/time';
import { deleteCookie, setCookie } from 'cookies-next';
import axios from 'axios';

export const Feedback_client = ({
    feedback_available
}: {
    feedback_available: boolean;
}) => {
    const feedback_retry = useNextCookie('feedback_retry', 1000);
    const [available, setAvailable] = useState<boolean>(feedback_available);

    useEffect(() => {
        setAvailable(new Date().getTime() > Number(feedback_retry ?? 0));
    }, [feedback_retry]);

    return available ? <Available /> : <Unavailable />;
};

const Available = () => {
    const [content, setContent] = useState<string>('');

    const send = async () => {
        if (content.length === 0) return;

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}user/feedback`,
            {
                content
            },
            { validateStatus: () => true }
        );

        if (response.status === 201) {
            const ratelimit =
                Number(response.headers['x-ratelimit-reset'] ?? 0) * 1000;
            setCookie('feedback_retry', new Date().getTime() + ratelimit);
        } else if (response.status === 429) {
            const retry = Number(response.headers['retry-after'] ?? 0) * 1000;
            setCookie('feedback_retry', new Date().getTime() + retry);
        } else {
            alert(
                `Ой! Произошла непредвиденная ошибка! Код: ${response.status}`
            );
        }
    };

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <div className={style.header}>
                    <IconSend />
                    <h3>Оставить фидбек</h3>
                </div>
                <p>
                    Поделитесь анонимным отзывом о сайте — нам важно ваше
                    мнение. Предложения, замечания и найденные баги помогут нам
                    стать лучше!
                </p>
            </div>

            <textarea
                placeholder="Введите текст сюда (макс. 1500 символов)"
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={1500}
            />
            <button className={style.send} onClick={send}>
                Отправить
            </button>
        </div>
    );
};

//X-RateLimit-Reset

const Unavailable = () => {
    const feedback_retry = useNextCookie('feedback_retry', 1000);
    const [retry, setRetry] = useState<number>(4);

    useEffect(() => {
        const updateRetry = () => {
            const retry = Number(feedback_retry);
            if (isNaN(retry)) return;
            const remaining_time = (retry - new Date().getTime()) / 1000;
            if (remaining_time < -5) return;

            if (remaining_time <= 5) deleteCookie('feedback_retry');
            setRetry(remaining_time);
        };

        updateRetry();
        const interval = setInterval(updateRetry, 1000);

        return () => clearInterval(interval);
    }, [feedback_retry]);

    return (
        <div className={`${style.container} ${style.container_unavailable}`}>
            <Image
                src="/static/peepoLove.png"
                alt="peepoLove"
                width={80}
                height={80}
            />
            <h3 className={style.thanks}>Спасибо за обратную связь!</h3>
            <p className={style.retry_after}>
                Отправить снова можно будет через{' '}
                {stringTimeDelta(Math.round(retry) - 4)}
            </p>
        </div>
    );
};
