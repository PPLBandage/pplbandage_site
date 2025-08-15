import StyleBtn from '@/styles/slidebtn.module.css';
import { useEffect, useState } from 'react';
import { StaticTooltip, StaticTooltipProps } from './Tooltip';

interface SlideButtonProps<Loadable extends boolean = false> {
    loadable?: Loadable;

    onChange: Loadable extends true
        ? (val: boolean) => Promise<void>
        : (val: boolean) => void;
    value?: boolean;
    label?: string;
    defaultValue?: boolean;
    strict?: boolean;
    disabled?: boolean;

    tooltip?: Omit<StaticTooltipProps, 'children'>;
}

export const SlideButton = <Loadable extends boolean = false>({
    onChange,
    value,
    label,
    defaultValue,
    strict,
    disabled,
    loadable,
    tooltip
}: SlideButtonProps<Loadable>) => {
    const [active, setActive] = useState<boolean>(value || defaultValue || false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

    useEffect(() => {
        setActive(value || defaultValue || false);
    }, [value]);

    const change = () => {
        if (!disabled && loadable) setLoading(true);
        setActive(prev => (!disabled && !loading ? !prev : prev));
    };

    useEffect(() => {
        if (active === undefined) return;
        if (error) {
            setError(false);
            return;
        }

        /*
            Строгий режим нужен, чтобы компонента не вызывала колбек при первом маунте.
        */
        if (isInitialMount && strict) {
            setIsInitialMount(false);
            return;
        }
        const promise = onChange(active);

        if (promise instanceof Promise) {
            promise
                .catch(() => {
                    setActive(prev => !prev);
                    setError(true);
                })
                .finally(() => setLoading(false));
        }
    }, [active]);

    // Говнокод, забейте (я сам уже не понимаю как он работает)
    const position = loading
        ? 'calc((2.6rem + 1px) / 2 - 1.3rem / 2)'
        : active
        ? '1.3rem'
        : '0';
    const color = loading
        ? 'rgb(77 83 99)'
        : disabled
        ? 'var(--category-color)'
        : active
        ? undefined
        : 'rgb(77 83 99)';

    return (
        <div className={StyleBtn.container}>
            <div
                className={StyleBtn.main}
                onClick={change}
                style={{ cursor: disabled ? 'auto' : 'pointer' }}
            >
                <StaticTooltip disabled {...tooltip} title={tooltip?.title || ''}>
                    <div
                        className={StyleBtn.child}
                        style={{ left: position, backgroundColor: color }}
                    />
                </StaticTooltip>
            </div>
            {label && (
                <label className={StyleBtn.label} onClick={change}>
                    {label}
                </label>
            )}
        </div>
    );
};

export default SlideButton;
