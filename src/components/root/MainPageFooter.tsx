import Link from 'next/link';
import IconCropped from '@/resources/icon-cropped.svg';
import styles from '@/styles/root/page.module.css';

export const MainPageFooter = () => {
    return (
        <footer className={styles.footer}>
            <p>
                Сайт pplbandage.ru не является официальной частью сети серверов{' '}
                <Link href="https://pepeland.net" target="_blank">
                    PepeLand
                </Link>
                .
                <Link href="/tos#PP" style={{ marginLeft: '.5rem' }}>
                    Privacy Policy
                </Link>
            </p>
            <IconCropped width={24} height={24} className={styles.logo} />
        </footer>
    );
};
