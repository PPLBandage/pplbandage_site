'use client';

import Style from '@/styles/me/connections.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { Connections } from '@/components/me/settings/Connections';
import { Themes } from '@/components/me/settings/Themes';
import { UserSettings } from '@/components/me/settings/UserSettings';
import { Safety } from '@/components/me/settings/Safety';
import useSWR from 'swr';
import ApiManager from '@/lib/apiManager';

const Page = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await ApiManager.getMeSettings()
    );

    if (isLoading || !data) return null;
    return (
        <div id="sidebar" className={`${Style.main} ${style_sidebar.hidable}`}>
            <UserSettings />
            <Connections />
            <Themes />
            <Safety />
        </div>
    );
};

export default Page;
