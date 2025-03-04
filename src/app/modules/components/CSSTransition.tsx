import { cloneElement, JSX, useEffect, useState } from 'react';

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
    const [state, setState] = useState<boolean>(props.state);
    const [animationClass, setAnimationClass] = useState<string>('');
    const [mounted, setMounted] = useState<boolean>(props.state);

    useEffect(() => {
        setState(props.state);
    }, [props.state]);

    useEffect(() => {
        let anim_request: number;
        if (state) {
            setMounted(true);
            setAnimationClass(props.classNames.enter);
            anim_request = requestAnimationFrame(() => {
                anim_request = requestAnimationFrame(() => {
                    setAnimationClass('');
                });
            });
        } else {
            setAnimationClass(props.classNames.exitActive);
            setTimeout(() => {
                setMounted(false);
            }, props.timeout);
        }

        return () => {
            cancelAnimationFrame(anim_request);
        };
    }, [state]);

    if (!mounted) return null;
    return cloneElement(props.children, {
        className: `${props.children.props.className || ''} ${animationClass}`
    });
};
export default ReactCSSTransition;
