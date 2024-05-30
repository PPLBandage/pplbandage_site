import { Mutex } from 'async-mutex';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { getCookie, deleteCookie, setCookie } from 'cookies-next';

var api = process.env.NEXT_PUBLIC_API_URL

interface CookieObj {
    sessionId: string,
    Path: string,
    Expires: string,
    SameSite: string
}

export const authApi = axios.create({
    baseURL: api,
    withCredentials: true,
    validateStatus: (status) => status != 401
});

const convertCookie = (cookie: string): CookieObj | null => {
    if (!cookie) return null;
    const splitted_cookie = cookie.split(';')
    const data = splitted_cookie.map((val) => val.split('='))
    const cookieObj = data.reduce((obj: any, cookie) => {
        obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());
        return obj;
    }, {})
    return cookieObj
}

authApi.defaults.headers.common['Content-Type'] = 'application/json';

const checkAccess = (token: string): boolean => {  // true if ready to refresh
    if (!token) return true;
    const seconds = Date.now() / 1000;
    const data = jwtDecode(token);
    if (!data.exp || !data.iat) return true;
    return data.iat + ((data.exp - data.iat) / 2) < seconds;
}

const tokenMutex = new Mutex();

authApi.interceptors.request.use(async (config) => {
    const sessionId = getCookie('sessionId') as string;
    if (checkAccess(sessionId)) {
        console.log('acquire mutex!');
        await tokenMutex.acquire();
        console.log('after mutex!');
        const currentSessionId = getCookie('sessionId') as string;
        if (sessionId != currentSessionId) {
            console.log("cookies updated!");
        }
    }
    return config;
});

authApi.interceptors.response.use((response) => {
    const setcookie = convertCookie(response.headers['setcookie']);
    if (setcookie) {
        setCookie('sessionId', setcookie.sessionId, { expires: new Date(setcookie.Expires), path: setcookie.Path, sameSite: setcookie.SameSite == 'true' });
    }
    tokenMutex.release();
    console.log('released mutex!');
    return response;
}, async (error) => {
    tokenMutex.release();
    console.log('released mutex due error!');
    deleteCookie('sessionId');
    return Promise.reject(error);
});