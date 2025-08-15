'use client';

import LoginWrapper from '@/components/me/accounts/LoginWrapper';
import { connectTelegram } from '@/lib/api/connections';
import { useEffect, useState } from 'react';

const Page = () => {
    const [code, setCode] = useState<string | null>(null);

    useEffect(() => {
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        setCode(params.get('tgAuthResult'));
    }, []);

    if (!code) return null;
    return (
        <LoginWrapper
            code={code}
            callback={connectTelegram}
            redirect_to="/me/accounts"
        />
    );
};

export default Page;
