export const generatePath = (
    external_id: string,
    referrer_str: string | null,
    author: string | undefined
) => {
    const names: { [key: string]: { name: string; url: string } } = {
        workshop: { name: 'Мастерская', url: '/workshop' },
        me: { name: 'Личный кабинет', url: '/me' },
        stars: { name: 'Избранное', url: '/me/stars' },
        notifications: { name: 'Уведомления', url: '/me/notifications' }
    };

    const default_path = [
        { name: 'Мастерская', url: '/workshop' },
        { name: external_id, url: `/workshop/${external_id}` }
    ];

    const referrer = referrer_str ?? window.sessionStorage.getItem('referrer');
    window.sessionStorage.removeItem('referrer');

    if (!referrer || referrer === window.location.pathname) {
        return default_path;
    }

    let result;
    if (referrer.startsWith('/users') && !!author) {
        const username = referrer.split('/').reverse()[0];
        result = [{ name: author, url: `/users/${username}` }];
    } else {
        result = referrer
            .split('/')
            .slice(1)
            .map(page => names[page]);
        if (result.some(page => !page)) return default_path;
    }

    return [...result, { name: external_id, url: `/workshop/${external_id}` }];
};
