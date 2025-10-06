import style from '@/styles/workshop/tag.module.css';
import { IconCrown } from '@tabler/icons-react';

const TagElement = ({ title }: { title: string }) => {
    const is_official = title === 'Официальные';
    return (
        <div className={`${style.container} ${is_official && style.official}`}>
            {is_official && (
                <IconCrown
                    width={16}
                    height={16}
                    strokeWidth={2}
                    color="var(--official-color)"
                />
            )}
            <p>{title}</p>
        </div>
    );
};

export default TagElement;
