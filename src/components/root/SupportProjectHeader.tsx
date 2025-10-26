'use client';

import { useNextCookie } from 'use-next-cookie';
import styles from '@/styles/root/support.module.css';
import { useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';
import ReactCSSTransition from '../CSSTransition';
import IconHeart from '@/resources/heart.svg';
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';

const SHOW_TIME = 60 * 3;
const maxAge = 60 * 24 * 365 * 10;

/** О НЕТ! ЖАДНЫЕ КАПИТАЛИСТЫ ВНЕДРИЛИ ВРЕДОНОСНЫЙ КОД В САЙТ ПРОЕКТА */
const SupportProjectHeader = () => {
    const [supportTime, setSupportTime] = useState<number>(
        parseInt(useNextCookie('donate-time-counter')!) || 0
    );
    const supportHidden = !!useNextCookie('hide-donate-header');
    const [state, setState] = useState<boolean>(
        !supportHidden && supportTime >= SHOW_TIME
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setSupportTime(prev => {
                const newValue = prev + 1;
                if (newValue > SHOW_TIME) {
                    if (!supportHidden) setState(true);
                    clearInterval(interval);
                    return prev;
                }
                setCookie('donate-time-counter', newValue, { maxAge });
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ReactCSSTransition
            timeout={400}
            state={state}
            classNames={{
                enter: styles.exit,
                exitActive: styles.exit
            }}
        >
            <div className={styles.container}>
                <Link
                    href="https://dalink.to/andcool_systems"
                    target="_blank"
                    className={styles.text}
                >
                    Помогите проекту стать лучше
                    <IconHeart className={styles.heart} />
                </Link>
                <IconX
                    className={styles.close}
                    onClick={() => {
                        setCookie('hide-donate-header', 'true', { maxAge });
                        setState(false);
                    }}
                />
            </div>
        </ReactCSSTransition>
    );
};

export default SupportProjectHeader;
