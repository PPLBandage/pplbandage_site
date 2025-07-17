'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { connectGoogle } from '@/lib/apiManager';
import { httpStatusCodes } from '@/lib/StatusCodes';
import LoadingWrapper from '@/components/me/accounts/LoadingWrapper';

const Page = () => {
    const router = useRouter();
    const params = useSearchParams();
    const code = params.get('code');
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    useEffect(() => {
        if (!code) router.replace('/me/accounts');

        connectGoogle(code)
            .then(() => router.replace('/me/accounts'))
            .catch(response => {
                setLoadingStatus(
                    `${response.status}: ${
                        response.data?.message || httpStatusCodes[response.status]
                    }`
                );
            });
    }, []);

    return <LoadingWrapper loadingStatus={loadingStatus} />;
};

export default Page;
