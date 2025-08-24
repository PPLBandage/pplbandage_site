'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Me } from '@/components/me/MeSidebar';
import { redirect, usePathname } from 'next/navigation';
import { useNextCookie } from 'use-next-cookie';
import useSWR from 'swr';
import { Users } from '@/types/global';
import { getMe } from '@/lib/api/user';
import { Login } from './Login';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import style from '@/styles/me/animated_content.module.css';
import ReactCSSTransition from '../CSSTransition';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname_full = usePathname();
    const pathname = pathname_full.split('/').reverse()[0];
    const session = useNextCookie('sessionId', 1000);
    const [isLogged, setIsLogged] = useState<boolean>(!!session);

    useEffect(() => {
        setIsLogged(!!session);
    }, [session]);

    if (pathname_full.includes('login') || pathname_full.includes('connect'))
        return children;
    if (pathname !== 'me' && !isLogged) redirect('/me');
    if (!isLogged) return <Login />;

    return <MeLoader>{children}</MeLoader>;
};

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

const MeLoader = ({ children }: { children: React.ReactNode }) => {
    const { data } = useSWR('me', () => getMe());

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
        }, 200);

        return () => {
            setVisible(true);
            clearTimeout(id);
        };
    }, [pathname]);

    if (!data) return null;
    return (
        <Me data={data as Users} self>
            <ReactCSSTransition
                timeout={200}
                state={visible}
                classNames={{
                    enter: style.enter,
                    exitActive: style.exit_active
                }}
            >
                <div className={style.common_anim} key={key}>
                    <FrozenRouter>{children}</FrozenRouter>
                </div>
            </ReactCSSTransition>
        </Me>
    );
};

export default Wrapper;
