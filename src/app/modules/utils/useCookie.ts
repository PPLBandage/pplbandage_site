import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useCookies } from 'next-client-cookies';

const useCookie = (cookieName: string) => {
    const cookies = useCookies();
    const [cookieValue, setCookieValue] = useState<string>(getCookie(cookieName) || cookies.get(cookieName));

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