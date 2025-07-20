import { Bandage } from '@/types/global';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from 'react';
import IconCandle from '@/resources/stars/candle.svg';
import IconCandleOn from '@/resources/stars/candle_on.svg';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import style_card from '@/styles/workshop/card.module.css';
import { setStar } from '@/lib/api/workshop';

const StarElement = ({ el }: { el: Bandage }) => {
    const _starred = Boolean(el.flags & (1 << 2));
    const logged = getCookie('sessionId');
    const router = useRouter();
    const [starred, setStarred] = useState<boolean>(_starred);
    const [last, setLast] = useState<boolean>(_starred);
    const [starsCount, setStarsCount] = useState<number>(el.stars_count);

    useEffect(() => {
        if (logged && starred != last) {
            setStar(el.external_id, { set: starred })
                .then(data => setStarsCount(data.new_count))
                .catch(console.error)
                .finally(() => setLast(starred));
        }
    }, [starred]);

    let StarIcon = undefined;

    switch (el.star_type) {
        case 1:
            StarIcon = starred ? IconCandleOn : IconCandle;
            break;
        default:
            StarIcon = starred ? IconStarFilled : IconStar;
            break;
    }

    return (
        <div
            className={style_card.star_container}
            onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                logged ? setStarred(prev => !prev) : router.push('/me');
            }}
        >
            <StarIcon
                className={style_card.star}
                width={el.star_type === 0 ? 24 : undefined}
                height={24}
                color={el.star_type === 0 ? '#ffb900' : undefined}
                id={el.external_id + '_star'}
                style={{ width: el.star_type === 0 ? 24 : 18 } as CSSProperties}
            />
            <span className={style_card.star_count} id={el.external_id + '_text'}>
                {starsCount}
            </span>
        </div>
    );
};

export default StarElement;
