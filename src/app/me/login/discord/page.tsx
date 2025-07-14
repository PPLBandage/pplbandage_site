'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loginDiscord } from '@/lib/apiManager';
import { httpStatusCodes } from '@/lib/StatusCodes';
import LoadingWrapper from '../../accounts/connect/Wrapper';

const Page = () => {
    const router = useRouter();
    const params = useSearchParams();
    const code = params.get('code');
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    useEffect(() => {
        if (!code) router.replace('/me');

        loginDiscord(code)
            .then(() => router.replace('/me'))
            .catch(response => {
                setLoadingStatus(
                    `${response.status}: ${
                        response.data.message || httpStatusCodes[response.status]
                    }`
                );
            });
    }, []);

    return <LoadingWrapper loadingStatus={loadingStatus} />;
};

export default Page;
