import styles from '@/styles/me/Badges.module.css';
import {
    IconCode,
    IconShieldFilled,
    IconBugFilled,
    IconGitMerge,
    IconBeta,
    IconQuestionMark
} from '@tabler/icons-react';
import { CSSProperties, JSX } from 'react';
import { StaticTooltip } from '../Tooltip';

const badgesIcons: Record<
    number,
    { icon: typeof IconShieldFilled; name: string; color?: string }
> = {
    0: {
        icon: IconShieldFilled,
        name: 'Модератор',
        color: 'oklch(68.5% 0.169 237.323)'
    },
    1: {
        icon: IconBugFilled,
        name: 'Искатель багов',
        color: 'oklch(85.2% 0.199 91.936)'
    },
    2: {
        icon: IconCode,
        name: 'Разработчик',
        color: 'oklch(72.3% 0.219 149.579)'
    },
    3: {
        icon: IconGitMerge,
        name: 'Контрибьютор',
        color: 'oklch(70.2% 0.183 293.541)'
    },
    4: {
        icon: IconBeta,
        name: 'Бета-тестер',
        color: 'oklch(68.5% 0.169 237.323)'
    },
    10: {
        icon: IconQuestionMark,
        name: 'Начал стал людям меньше'
    }
};

const Badges = ({ badges }: { badges: number }) => {
    if (badges === 0 || badges === undefined) return undefined;

    const badgesArr = badges
        .toString(2)
        .split('')
        .reverse()
        .reduce((acc: JSX.Element[], v, i) => {
            if (v === '1') {
                const El = badgesIcons[i];
                if (El == undefined) return acc;
                acc.push(
                    <StaticTooltip
                        key={i}
                        title={El.name}
                        container_styles={{ display: 'flex' }}
                        tooltip_styles={{ minWidth: 'max-content' }}
                    >
                        <El.icon
                            width={16}
                            height={16}
                            style={{ '--color': El.color } as CSSProperties}
                            className={styles.icon}
                        />
                    </StaticTooltip>
                );
            }
            return acc;
        }, []);

    return <div className={styles.container}>{badgesArr}</div>;
};

export default Badges;
