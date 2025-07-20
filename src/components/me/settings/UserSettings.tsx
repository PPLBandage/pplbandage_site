import SlideButton from '@/components/SlideButton';
import { IconUser } from '@tabler/icons-react';
import Style from '@/styles/me/connections.module.css';
import useSWR from 'swr';
import { getMeSettings, setUserSetting } from '@/lib/api/user';
import AvatarSelector from './AvatarSelector';
import { Loading } from './Loading';

export const UserSettings = () => {
    return (
        <div className={Style.container}>
            <h3>
                <IconUser />
                Настройки аккаунта
            </h3>
            <Settings />
        </div>
    );
};

const Settings = () => {
    const { data, isLoading, mutate } = useSWR(
        'userSettings',
        async () => await getMeSettings()
    );

    if (isLoading || !data) return <Loading />;

    return (
        <>
            <SlideButton
                label="Публичный профиль"
                defaultValue={data.can_be_public ? data.public_profile : false}
                onChange={async state => {
                    await setUserSetting({ public_profile: state });
                    mutate({ ...data, public_profile: state }, false);
                }}
                disabled={!data.can_be_public}
                tooltip={{
                    title: 'У вас еще нет повязок',
                    disabled: data.can_be_public
                }}
                loadable
                strict
            />
            <AvatarSelector />
        </>
    );
};
