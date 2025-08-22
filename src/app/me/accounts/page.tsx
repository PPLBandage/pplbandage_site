'use client';

import { Discord } from '@/components/me/accounts/Discord';
import { Minecraft } from '@/components/me/accounts/Minecraft';
import Style from '@/styles/me/connections.module.css';
import useSWR from 'swr';
import { Google } from '@/components/me/accounts/Google';
import { Twitch } from '@/components/me/accounts/Twitch';
import { getMeConnections } from '@/lib/api/connections';
import { Telegram } from '@/components/me/accounts/Telegram';

const Page = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading || !data) return null;
    return (
        <div className={Style.main}>
            <Google />
            <Discord />
            <Twitch />
            <Minecraft />
            <Telegram />
        </div>
    );
};

export default Page;
