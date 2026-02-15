import styles from '@/styles/me/Badges.module.css';
import {
    IconCode,
    IconShieldFilled,
    IconBugFilled,
    IconGitMerge,
    IconBeta,
    IconQuestionMark,
    IconHeartDollar,
    IconFlameFilled,
    IconApple,
    IconLeaf,
    IconMusic,
    IconSnowflake,
    IconSparkles,
    IconSparkles2,
    IconStarFilled,
    IconBoltFilled,
    IconBulbFilled,
    IconPaletteFilled,
    IconSunFilled,
    IconMoonFilled,
    IconConfettiFilled,
    IconPawFilled,
    IconChristmasTreeFilled,
    IconFishHook
} from '@tabler/icons-react';
import { CSSProperties, JSX } from 'react';
import { StaticTooltip } from '../Tooltip';
import { UserQuery } from '@/types/global';
import IconCropped from '@/resources/icon.svg';
import { hashString, mulberry32, randomHex } from '@/lib/randomThings';

const badgesIcons: Record<
    number,
    {
        icon: typeof IconShieldFilled | null;
        name: string;
        color?: string | string[] | null;
    }
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
    5: {
        icon: IconHeartDollar,
        name: 'Спонсор',
        color: 'oklch(79.5% 0.184 86.047)'
    },
    6: {
        icon: null,
        name: 'Эксклюзивный бадж: {name}',
        color: null
    },
    7: {
        icon: IconFishHook,
        name: 'Преданный рыбак',
        color: ['#1e6121', '#32aae1']
    },
    10: {
        icon: IconQuestionMark,
        name: 'Начал стал людям меньше'
    }
};

const ExclusiveBadgeIcons: (typeof IconApple)[] = [
    IconStarFilled,
    IconBoltFilled,
    IconBulbFilled,
    IconPaletteFilled,
    IconSparkles,
    IconSparkles2,
    IconCropped,
    IconFlameFilled,
    IconSunFilled,
    IconMoonFilled,
    IconLeaf,
    IconMusic,
    IconConfettiFilled,
    IconPawFilled,
    IconSnowflake,
    IconChristmasTreeFilled,
    IconApple
];

const Badges = ({ user }: { user: UserQuery }) => {
    if (user.badges === 0 || user.badges === undefined) return undefined;

    const seed = hashString(user.name);
    const rng = mulberry32(seed);

    const badgesArr = user.badges
        .toString(2)
        .split('')
        .reverse()
        .reduce((acc: JSX.Element[], v, i) => {
            if (v === '0') return acc;
            const El = badgesIcons[i];
            if (El == undefined) return acc;

            let color_style: CSSProperties = {};
            let Icon = El.icon;

            if (Array.isArray(El.color) || El.color === null) {
                let colors = El.color as string[];
                if (El.color === null) {
                    colors = [randomHex(rng), randomHex(rng)];
                }

                const length = colors.length - 1;
                const gradient_colors = colors
                    .map((color, index) => `${color} ${(index / length) * 100}%`)
                    .join(', ');
                color_style = {
                    background: `linear-gradient(326deg, ${gradient_colors})`
                };
            } else {
                color_style = { backgroundColor: El.color ?? '#fff' };
            }

            if (Icon === null) {
                Icon =
                    ExclusiveBadgeIcons[
                        Math.floor(rng() * ExclusiveBadgeIcons.length)
                    ];
            }

            const name = El.name.replaceAll('{name}', user.name);
            acc.push(
                <StaticTooltip
                    key={i}
                    title={name}
                    container_styles={{ display: 'flex' }}
                    tooltip_styles={{ minWidth: 'max-content' }}
                >
                    <Icon
                        width={16}
                        height={16}
                        style={color_style}
                        className={styles.icon}
                    />
                </StaticTooltip>
            );
            return acc;
        }, []);

    return <div className={styles.container}>{badgesArr}</div>;
};

export default Badges;
