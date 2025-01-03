import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next/client';
import { useCookiesServer } from './CookiesProvider/CookieProvider';

const useCookie = (cookieName: string) => {
    const cookies = useCookiesServer();
    const [cookieValue, setCookieValue] = useState<string>(cookies.get(cookieName) || getCookie(cookieName));

    useEffect(() => {
        const handleCookieChange = () => {
            setCookieValue(getCookie(cookieName));
        };
        const intervalId = setInterval(handleCookieChange, 1000);
        return () => clearInterval(intervalId);
    }, [cookieName]);

    return cookieValue;
};

export default useCookie;