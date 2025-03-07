import Style from '@/app/styles/slider.module.css';
import { useEffect, useState } from 'react';

const Slider = ({
    initial,
    range,
    onChange
}: {
    initial: number;
    range: number;
    onChange(val: number): void;
}) => {
    const [position, setPosition] = useState<number>(0);
    const [lastVal, setLastVal] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);

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
        setIsDragging(true);
        document.body.style.userSelect = 'none';
        const clientY =
            'touches' in event ? event.touches[0].clientY : event.clientY;
        const position = calcPosition(range, clientY);
        setPosition(position.position);
        if (position.value !== lastVal) {
            onChange(position.value);
            setLastVal(position.value);
        }
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
        setIsDragging(false);
        document.body.style.userSelect = 'auto';
    };

    useEffect(() => {
        setPosition(calcPosition(range, 0, initial).position);
    }, [initial, range]);

    return (
        <>
            {isDragging && (
                <div
                    className={Style.slider_block}
                    onMouseMove={mouseMove}
                    onMouseUp={mouseUp}
                    onTouchMove={mouseMove}
                    onTouchEnd={mouseUp}
                />
            )}
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
                    style={{ top: `${position}%`, touchAction: 'none' }}
                    onTouchMove={mouseMove}
                    onMouseDown={mouseDown}
                    onTouchStart={mouseDown}
                />
            </div>
        </>
    );
};

export default Slider;
