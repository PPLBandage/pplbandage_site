import { IconArrowNarrowRight } from '@tabler/icons-react';
import styles from '@/styles/admin/MoveBack.module.css';
import Link from 'next/link';

export const MoveBack = () => {
    return (
        <div className={styles.cont}>
            <Link className={styles.link} href="/admin">
                <IconArrowNarrowRight width={20} height={20} />
                <span>Назад</span>
            </Link>
        </div>
    );
};
