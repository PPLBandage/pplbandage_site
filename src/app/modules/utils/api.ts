import { Mutex } from 'async-mutex';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';

const api = process.env.NEXT_PUBLIC_API_URL;
const login_endpoints = ['/auth/discord/', '/auth/minecraft/'];

interface CookieObj {
    sessionId: string;
    Path: string;
    Expires: string;
    SameSite: string;
}

export const authApi = axios.create({
    baseURL: api,
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache'
    },
    validateStatus: status => status != 401
});

const convertCookie = (cookie: string): CookieObj | null => {
    if (!cookie) return null;
    const splitted_cookie = cookie.split(';');
    const data = splitted_cookie.map(val => val.split('='));
    const cookieObj = data.reduce((obj: { [key: string]: string }, cookie) => {
        obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
            cookie[1].trim()
        );
        return obj;
    }, {});
    return cookieObj as unknown as CookieObj;
};

authApi.defaults.headers.common['Content-Type'] = 'application/json';

const checkAccess = (token: string): boolean => {
    // true if ready to refresh
    if (!token) return true;
    const seconds = Date.now() / 1000;
    const data = jwtDecode(token);
    if (!data.exp || !data.iat) return true;
    return data.iat + (data.exp - data.iat) / 2 < seconds;
};

const tokenMutex = new Mutex();

authApi.interceptors.request.use(async config => {
    const sessionId = getCookie('sessionId') as string;
    if (
        !sessionId &&
        !login_endpoints.some(url => config.url.startsWith(url))
    ) {
        const error = new Error('No cookie');
        return Promise.reject(error);
    }

    let valid = false;
    try {
        valid = checkAccess(sessionId);
    } catch {
        deleteCookie('sessionId');
    }

    if (valid) {
        await tokenMutex.acquire();
    }
    return config;
});

authApi.interceptors.response.use(
    response => {
        const setcookie = convertCookie(response.headers['setcookie']);
        if (setcookie) {
            setCookie('sessionId', setcookie.sessionId, {
                expires: new Date(setcookie.Expires),
                path: setcookie.Path,
                sameSite: setcookie.SameSite == 'true'
            });
        }
        tokenMutex.release();
        return response;
    },
    async error => {
        tokenMutex.release();
        if (error.message != 'No cookie' && error.response?.status == 401) {
            deleteCookie('sessionId');
        }
        return Promise.reject(error);
    }
);
