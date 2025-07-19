'use client';

import { useSearchParams } from 'next/navigation';
import { loginTwitch } from '@/lib/apiManager';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return <LoginWrapper code={code} callback={loginTwitch} />;
};

export default Page;
