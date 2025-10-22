/* eslint-disable react-hooks/refs */
'use client';

import ReactCSSTransition from '@/components/CSSTransition';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import style from '@/styles/blog/main.module.css';

function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext ?? {});
    const frozen = useRef(context).current;

    if (!frozen) {
        return <>{props.children}</>;
    }

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {props.children}
        </LayoutRouterContext.Provider>
    );
}

const TransitionEffect = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [visible, setVisible] = useState(true);
    const [key, setKey] = useState<string>(pathname);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }

        setVisible(false);
        const id = setTimeout(() => {
            setVisible(true);
            setKey(pathname);
        }, 400);

        return () => {
            clearTimeout(id);
            setVisible(true);
        };
    }, [pathname]);

    return (
        <ReactCSSTransition
            timeout={400}
            state={visible}
            classNames={{
                enter: style.enter,
                exitActive: style.exit_active
            }}
        >
            <div className={style.common_anim} key={key}>
                <FrozenRouter>
                    <div className={style.in_anim}>{children}</div>
                </FrozenRouter>
            </div>
        </ReactCSSTransition>
    );
};

export default TransitionEffect;
