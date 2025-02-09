import { cloneElement, JSX, useEffect } from 'react';
import { useTransitionState } from 'react-transition-state';

interface ReactCSSTransitionProps {
    timeout: number;
    children: JSX.Element;
    state: boolean;
    classNames: {
        enter: string;
        exitActive: string;
    };
}

const getClassName = (state: string, classNames: ReactCSSTransitionProps['classNames']) => {
    switch (state) {
        case 'preEnter':
        case 'exiting':
            return classNames.enter;

        case 'exited':
        case 'unmounted':
            return classNames.exitActive;
    }
};

const ReactCSSTransition = (props: ReactCSSTransitionProps) => {
    const [{ status, isMounted }, toggle] = useTransitionState({
        timeout: props.timeout,
        preEnter: true,
        unmountOnExit: true,
        mountOnEnter: true,
        initialEntered: props.state
    });

    useEffect(() => {
        toggle(props.state);
    }, [props.state]);

    if (!isMounted) return null;

    return cloneElement(props.children, {
        className: `${props.children.props.className || ''} ${getClassName(status, props.classNames)}`
    });
};
export default ReactCSSTransition;
