'use client';

import { useSearchParams } from 'next/navigation';
import { loginGoogle } from '@/lib/apiManager';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return <LoginWrapper code={code} callback={loginGoogle} />;
};

export default Page;
