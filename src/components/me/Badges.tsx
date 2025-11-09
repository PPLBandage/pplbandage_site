import styles from '@/styles/me/Badges.module.css';
import {
    IconCode,
    IconShieldFilled,
    IconBugFilled,
    IconGitMerge,
    IconBeta,
    IconQuestionMark
} from '@tabler/icons-react';
import { JSX } from 'react';
import { StaticTooltip } from '../Tooltip';

const badgesIcons: Record<
    number,
    { icon: typeof IconShieldFilled; name: string; color?: string }
> = {
    0: {
        icon: IconShieldFilled,
        name: 'Модератор'
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
        name: 'Контрибьютор'
    },
    4: {
        icon: IconBeta,
        name: 'Бета-тестер'
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
                        <El.icon width={16} height={16} color={El.color} />
                    </StaticTooltip>
                );
            }
            return acc;
        }, []);

    return <div className={styles.container}>{badgesArr}</div>;
};

export default Badges;
