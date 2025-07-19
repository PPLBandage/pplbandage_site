'use client';

import { Discord } from '@/components/me/accounts/Discord';
import { Minecraft } from '@/components/me/accounts/Minecraft';
import Style from '@/styles/me/connections.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { getMeConnections } from '@/lib/apiManager';
import useSWR from 'swr';
import { Google } from '@/components/me/accounts/Google';
import { Twitch } from '@/components/me/accounts/Twitch';

const Page = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading || !data) return null;
    return (
        <div id="sidebar" className={`${Style.main} ${style_sidebar.hidable}`}>
            <Google />
            <Discord />
            <Twitch />
            <Minecraft />
        </div>
    );
};

export default Page;
