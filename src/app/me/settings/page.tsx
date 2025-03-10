'use client';

import Style from '@/app/styles/me/connections.module.css';
import style_sidebar from '@/app/styles/me/sidebar.module.css';
import { Connections } from './components/Connections';
import { Themes } from './components/Themes';
import { UserSettings } from './components/UserSettings';
import { Safety } from './components/Safety';
import useSWR from 'swr';
import ApiManager from '@/app/modules/utils/apiManager';

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
