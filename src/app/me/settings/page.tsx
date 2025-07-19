'use client';

import Style from '@/styles/me/connections.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { Themes } from '@/components/me/settings/Themes';
import { UserSettings } from '@/components/me/settings/UserSettings';
import { Safety } from '@/components/me/settings/Safety';
import useSWR from 'swr';
import { getMeSettings } from '@/lib/api/user';

const Page = () => {
    const { data, isLoading } = useSWR(
        'userSettings',
        async () => await getMeSettings()
    );

    if (isLoading || !data) return null;
    return (
        <div id="sidebar" className={`${Style.main} ${style_sidebar.hidable}`}>
            <UserSettings />
            <Themes />
            <Safety />
        </div>
    );
};

export default Page;
