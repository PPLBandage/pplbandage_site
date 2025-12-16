import style_card from '@/styles/workshop/card.module.css';
import TagElement from './TagElement';
import { useEffect, useRef } from 'react';

const TagsElement = ({ tags }: { tags: string[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const movingContRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (!movingContRef.current) return;
            const max_scroll = movingContRef.current!.clientWidth;
            const cont_width = ref.current!.clientWidth - 16;
            if (max_scroll < cont_width) return;

            e.preventDefault();
            const current_scroll = parseInt(
                movingContRef.current!.style.left.slice(0, -2) || '0'
            );

            if (e.deltaY > 0) {
                const new_val = Math.max(
                    current_scroll - 20,
                    -(max_scroll - cont_width)
                );
                movingContRef.current.style.left = `${new_val}px`;
            } else {
                const new_val = Math.min(0, current_scroll + 20);
                movingContRef.current.style.left = `${new_val}px`;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', onWheel);
        };
    }, []);

    if (tags.includes('Официальные'))
        tags = ['Официальные', ...tags.filter(el => el !== 'Официальные')];

    const tagsEl = tags.map(tag => <TagElement title={tag} key={tag} />);
    return (
        <div className={style_card.tags_cont} ref={ref}>
            <div ref={movingContRef} className={style_card.tags}>
                {tagsEl}
            </div>
        </div>
    );
};

export default TagsElement;
