'use client';

import { useSearchParams } from 'next/navigation';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';
import { loginTelegram } from '@/lib/api/auth';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return <LoginWrapper code={code} callback={loginTelegram} />;
};

export default Page;
