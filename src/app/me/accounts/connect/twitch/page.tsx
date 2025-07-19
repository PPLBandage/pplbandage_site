'use client';

import { connectTwitch } from '@/lib/apiManager';
import LoginWrapper from '@/components/me/accounts/LoginWrapper';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const params = useSearchParams();
    const code = params.get('code');

    return <LoginWrapper code={code} callback={connectTwitch} />;
};

export default Page;
