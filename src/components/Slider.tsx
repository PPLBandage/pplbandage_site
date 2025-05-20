import Style from '@/styles/slider.module.css';
import { useEffect, useRef, useState } from 'react';

/*
    У этой компоненты есть большая проблема. Так как JavaScript однопоточный,
    то при сдвиге слайдера, который вызывает ререндер скина, перемещение слайдера будет заблокировано.
    
    Стандартный вертикальный слайдер использовать не выйдет, так как сюрприз-сюрприз,
    он не работает нормально в FireFox.

    upd 20.05.2025: useState заменен на простой useRef, так как useState вызывает ререндер всей компоненты,
    что сказывается на производительности
*/
const Slider = ({
    initial,
    range,
    onChange
}: {
    initial: number;
    range: number;
    onChange(val: number): void;
}) => {
    const [lastVal, setLastVal] = useState<number>(0);
    const thumb = useRef<HTMLDivElement>(null);

    const setPosition = (pos: number) => {
        if (thumb.current) {
            thumb.current.style.top = `${pos}%`;
        }
    };

    const calcPosition = (range: number, y: number, ival?: number) => {
        const rect = document.getElementById('track').getBoundingClientRect();
        const realRange = (rect.height - 16) / range;
        const value =
            ival ??
            Math.min(
                Math.max(Math.floor((y - rect.top) / realRange), 0),
                range
            );
        const val = ((value * realRange) / rect.height) * 100;
        return {
            position: Math.min(val, ((rect.height - 16) / rect.height) * 100),
            value: value
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mouseDown = (event: any) => {
        document.body.style.userSelect = 'none';
        const clientY =
            'touches' in event ? event.touches[0].clientY : event.clientY;
        const position = calcPosition(range, clientY);
        setPosition(position.position);
        if (position.value !== lastVal) {
            onChange(position.value);
            setLastVal(position.value);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('touchmove', mouseMove);
        document.addEventListener('touchend', mouseUp);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mouseMove = (event: any) => {
        const clientY =
            'touches' in event ? event.touches[0].clientY : event.clientY;
        const position = calcPosition(range, clientY);
        setPosition(position.position);
        if (position.value !== lastVal) {
            onChange(position.value);
            setLastVal(position.value);
        }
    };

    const mouseUp = () => {
        document.body.style.userSelect = 'auto';

        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('touchmove', mouseMove);
        document.removeEventListener('touchend', mouseUp);
    };

    useEffect(() => {
        setPosition(calcPosition(range, 0, initial).position);
    }, [initial, range]);

    return (
        <>
            <div
                className={Style.track}
                id="track"
                onMouseUp={mouseUp}
                onTouchEnd={mouseUp}
                onTouchMove={mouseMove}
                onMouseDown={mouseDown}
            >
                <div
                    className={Style.thumb}
                    ref={thumb}
                    style={{ touchAction: 'none' }}
                    onTouchMove={mouseMove}
                    onMouseDown={mouseDown}
                    onTouchStart={mouseDown}
                />
            </div>
        </>
    );
};

export default Slider;
