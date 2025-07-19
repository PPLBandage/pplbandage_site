'use client';

import { useSearchParams } from 'next/navigation';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';
import { connectDiscord } from '@/lib/api/connections';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return (
        <LoginWrapper
            code={code}
            callback={connectDiscord}
            redirect_to="/me/accounts"
        />
    );
};

export default Page;
