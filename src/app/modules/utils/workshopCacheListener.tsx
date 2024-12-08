'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WorkshopCacheListener = (): null => {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname.startsWith('/workshop')) {
            sessionStorage.removeItem('workshopState');
        }
    }, [pathname]);

    return null;
};

export default WorkshopCacheListener;
