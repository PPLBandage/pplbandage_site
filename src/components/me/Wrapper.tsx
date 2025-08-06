'use client';

import React, { JSX, useEffect, useState } from 'react';
import { Me } from '@/components/me/MeSidebar';
import { redirect, usePathname } from 'next/navigation';
import { useNextCookie } from 'use-next-cookie';
import useSWR from 'swr';
import { Users } from '@/types/global';
import { getMe } from '@/lib/api/user';
import { Login } from './Login';

const Wrapper = ({ children }: { children: JSX.Element }) => {
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

const MeLoader = ({ children }: { children: JSX.Element }) => {
    const { data } = useSWR('me', () => getMe());

    if (!data) return null;
    return (
        <Me data={data as Users} self>
            {children}
        </Me>
    );
};

export default Wrapper;
