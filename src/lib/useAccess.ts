import { jwtDecode } from 'jwt-decode';
import { useNextCookie } from 'use-next-cookie';

const useAccess = (): number[] => {
    const cookie = useNextCookie('sessionId');
    if (!cookie) {
        return [];
    }

    let access_flags: number;
    try {
        access_flags = (jwtDecode(cookie) as { access: number }).access;
    } catch {
        return [];
    }

    access_flags &= ~1;
    return access_flags
        .toString(2)
        .split('')
        .reverse()
        .reduce((acc: number[], curr, index) => {
            if (curr === '1') acc.push(index);
            return acc;
        }, []);
};

export default useAccess;
