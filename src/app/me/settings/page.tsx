'use client';

import Style from '@/styles/me/connections.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { Appearance } from '@/components/me/settings/Appearance';
import { UserSettings } from '@/components/me/settings/UserSettings';
import { Safety } from '@/components/me/settings/Safety';
import useSWR from 'swr';
import { getMeSettings } from '@/lib/api/user';
import AccountDeletion from '@/components/me/settings/DeleteAccount';

const Page = () => {
    const { data, isLoading } = useSWR(
        'userSettings',
        async () => await getMeSettings()
    );

    if (isLoading || !data) return null;
    return (
        <div className={`${Style.main} ${style_sidebar.hidable}`}>
            <UserSettings />
            <Appearance />
            <Safety />
            <AccountDeletion />
        </div>
    );
};

export default Page;
