import StyleBtn from "@/app/styles/slidebtn.module.css";
import { useEffect, useRef, useState } from "react";

interface SlideButtonProps {
    onChange: (val: boolean, resolve?: () => void) => void;
    value?: boolean;
    label?: string;
    defaultValue?: boolean;
    strict?: boolean,
    disabled?: boolean,
    loadable?: boolean
}

export const SlideButton = ({
    onChange,
    value,
    label,
    defaultValue,
    strict,
    disabled,
    loadable
}: SlideButtonProps) => {
    const [active, setActive] = useState<boolean>(value || defaultValue || false);
    const [loading, setLoading] = useState<boolean>(false);
    const isInitialMount = useRef<boolean>(true);

    useEffect(() => {
        setActive(value || defaultValue || false);
    }, [value]);

    const resolve = () => {
        setLoading(false);
    }

    useEffect(() => {
        if (active === undefined) return;
        if (isInitialMount.current && strict) {
            isInitialMount.current = false;
        } else {
            onChange(active, resolve);
        }
    }, [active]);

    const position = loading ? 'calc((2.6rem + 1px) / 2 - 1.3rem / 2)' : active ? '1.3rem' : '0';
    const color = loading ? 'rgb(77 83 99)' : (disabled ? 'var(--category-color)' : (active ? undefined : 'rgb(77 83 99)'));

    return (
        <div className={StyleBtn.container}>
            <div className={StyleBtn.main} onClick={() => {
                loadable && setLoading(true);
                setActive(prev => !disabled && !loading ? !prev : prev);
            }} style={{ cursor: disabled ? 'auto' : 'pointer' }}>
                <div className={StyleBtn.child} style={{ left: position, backgroundColor: color }} />
            </div>
            {label && <label className={StyleBtn.label} onClick={() => setActive(prev => !disabled ? !prev : prev)}>{label}</label>}
        </div>
    );
}


export default SlideButton;