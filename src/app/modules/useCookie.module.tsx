import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

const useCookie = (cookieName: string) => {
    const [cookieValue, setCookieValue] = useState<string>(getCookie(cookieName));

    useEffect(() => {
        const handleCookieChange = () => {
            setCookieValue(getCookie(cookieName));
        };

        // Запускаем проверку изменения кукис
        const intervalId = setInterval(handleCookieChange, 1000); // Проверка каждые 1000 мс

        return () => clearInterval(intervalId);
    }, [cookieName]);

    return cookieValue;
};

export default useCookie;