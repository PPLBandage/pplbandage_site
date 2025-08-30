import { IconHeartHandshake } from '@tabler/icons-react';
import styles_layout from '@/styles/contacts/feedback.module.css';
import styles from '@/styles/contacts/thanks.module.css';
import Link from 'next/link';

export const Thanks = () => {
    return (
        <div className={`${styles_layout.container} ${styles.container}`}>
            <div className={styles_layout.header}>
                <IconHeartHandshake />
                <h3>Благодарности</h3>
            </div>
            <p>Отдельное спасибо тем, кто помогал создавать этот проект:</p>
            <ul>
                <li>
                    Создание анимаций для главной страницы –{' '}
                    <Link href="https://t.me/Dey_PPL">
                        <b>DEY</b>
                    </Link>
                </li>
                <li>
                    Первоначальный продакшн – <b>Shape STD</b>
                </li>
                <li>
                    Советы по разработке и первоначальная тестировка – <b>Krimax</b>
                </li>
            </ul>
        </div>
    );
};
