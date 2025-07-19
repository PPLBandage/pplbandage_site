'use client';

import { useSearchParams } from 'next/navigation';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';
import { connectGoogle } from '@/lib/api/connections';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return (
        <LoginWrapper
            code={code}
            callback={connectGoogle}
            redirect_to="/me/accounts"
        />
    );
};

export default Page;
