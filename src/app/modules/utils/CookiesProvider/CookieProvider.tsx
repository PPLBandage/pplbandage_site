"use client";

import { createContext, useContext, ReactNode } from "react";

interface CookiesContextProps {
    get: (name: string) => string | undefined;
}

type CookieType = [string, { name: string, value: string }];

const CookiesContext = createContext<CookiesContextProps | undefined>(undefined);

export const useCookiesServer = (): CookiesContextProps => {
    const context = useContext(CookiesContext);
    if (!context) {
        throw new Error("CookieProvider not mounted");
    }
    return context;
};


export const CookiesContextProvider = ({ children, value }: { children: ReactNode, value: any }) => {
    const get = (name: string) => {
        const cookie: CookieType = value.find((cookie: CookieType) => cookie[0] === name);
        if (!cookie) return undefined;
        return cookie[1].value;
    }

    return (
        <CookiesContext.Provider value={{ get }}>
            {children}
        </CookiesContext.Provider>
    );
};