'use server';

import { CookiesContextProvider } from './CookieProvider';
import { cookies } from 'next/headers';

export const CookieProvider = async ({ children }: { children: React.ReactNode }) => {
    const _cookies = await cookies();

    return <CookiesContextProvider value={_cookies.getAll()}>{children}</CookiesContextProvider>;
};
