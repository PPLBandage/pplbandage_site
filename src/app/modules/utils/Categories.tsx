import {
    IconPuzzle,
    IconChristmasTree,
    IconClock,
    IconPalette,
    IconBan,
    IconFlag,
    IconPumpkinScary,
    IconCalendar,
    IconSnowflake,
    IconSun,
    IconTree,
    IconSeeding,
    IconRosetteDiscountCheck,
    IconLeaf2,
    IconUserCheck,
    IconUserEdit,
    IconQuestionMark
} from '@tabler/icons-react';
import { JSX } from 'react';

const Icons: { [key: string]: JSX.Element } = {
    IconBrush: <IconPuzzle width={15} height={15} />,
    IconChristmasTree: <IconChristmasTree width={15} height={15} />,
    IconClock: <IconClock width={15} height={15} color="#ffd500" />,
    IconPalette: <IconPalette width={15} height={15} />,
    IconBan: <IconBan width={15} height={15} color="#ff2424" />,
    IconFlag: <IconFlag width={15} height={15} />,
    IconPumpkinScary: <IconPumpkinScary width={15} height={15} />,
    IconLeaf: <IconCalendar width={15} height={15} />,
    IconSnowflake: <IconSnowflake width={15} height={15} />,
    IconSun: <IconSun width={15} height={15} />,
    IconTree: <IconTree width={15} height={15} />,
    IconSeeding: <IconSeeding width={15} height={15} />,
    IconRosetteDiscountCheck: (
        <IconRosetteDiscountCheck width={15} height={15} />
    ),
    IconLeaf2: <IconLeaf2 width={15} height={15} />,
    IconUserCheck: <IconUserCheck width={15} height={15} />,
    IconUserEdit: <IconUserEdit width={15} height={15} />
};

export const getIcon = (icon: string) =>
    Icons[icon] ?? <IconQuestionMark width={15} height={15} />;
