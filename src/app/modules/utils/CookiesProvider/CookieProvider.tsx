'use client';

import { createContext, useContext, ReactNode } from 'react';

interface CookiesContextProps {
    get: (name: string) => string | undefined;
}

const CookiesContext = createContext<CookiesContextProps | undefined>(undefined);

export const useCookiesServer = (): CookiesContextProps => {
    const context = useContext(CookiesContext);
    if (!context) throw new Error('CookieProvider not mounted');
    return context;
};

export const CookiesContextProvider = ({
    children,
    value
}: {
    children: ReactNode;
    value: { name: string; value: string }[];
}) => {
    const get = (name: string) => value.find((cookie) => cookie.name === name)?.value;

    return <CookiesContext.Provider value={{ get }}>{children}</CookiesContext.Provider>;
};
