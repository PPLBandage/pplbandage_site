import { cloneElement, JSX, useEffect, useRef, useState } from 'react';

interface ReactCSSTransitionProps {
    timeout: number;
    children: JSX.Element;
    state: boolean;
    classNames: {
        enter: string;
        exitActive: string;
    };
}

const ReactCSSTransition = (props: ReactCSSTransitionProps) => {
    const [animationClass, setAnimationClass] = useState<string>('');
    const [mounted, setMounted] = useState<boolean>(props.state);
    const firstRender = useRef<boolean>(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        let anim_request: number;
        let timeout: NodeJS.Timeout;
        if (props.state) {
            setMounted(true);
            setAnimationClass(props.classNames.enter);

            /*
                Код ниже — костыль для правильной работы анимации в браузерах FireFox.
                По какой-то причине, времени requestAnimationFrame недостаточно для полного маунта компоненты
                Поэтому приходится пропускать два фрейма, чтобы дать компоненту смонтироваться.
            */
            anim_request = requestAnimationFrame(() => {
                anim_request = requestAnimationFrame(() => {
                    setAnimationClass('');
                });
            });
        } else {
            setAnimationClass(props.classNames.exitActive);
            timeout = setTimeout(() => {
                setMounted(false);
            }, props.timeout);
        }

        return () => {
            cancelAnimationFrame(anim_request);
            clearTimeout(timeout);
        };
    }, [props.state]);

    if (!mounted) return null;
    return cloneElement(props.children, {
        className: `${props.children.props.className || ''} ${animationClass}`
    });
};
export default ReactCSSTransition;
