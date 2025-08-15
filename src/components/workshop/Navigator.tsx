import Link from 'next/link';
import styles from '@/styles/navigator.module.css';
import { IconChevronRight } from '@tabler/icons-react';
import { JSX } from 'react';

interface NavigatorProps {
    path: {
        name: string;
        url: string;
    }[];
    style?: React.CSSProperties;
}

const NavigatorEl = ({ path, style }: NavigatorProps) => {
    const rendered_path = path.reduce((acc: JSX.Element[], element, index) => {
        if (index > 0) {
            acc.push(
                <IconChevronRight
                    key={`separator-${index}`}
                    className={styles.arrow}
                />
            );
        }
        acc.push(
            <Link
                href={element.url}
                key={element.url}
                className={`${styles.link} ${
                    index == path.length - 1 && styles.last_link
                }`}
            >
                {element.name}
            </Link>
        );
        return acc;
    }, []);

    return (
        <div className={styles.container} style={style}>
            {rendered_path}
        </div>
    );
};

export default NavigatorEl;
