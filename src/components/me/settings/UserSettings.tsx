import SlideButton from '@/components/SlideButton';
import { IconUser } from '@tabler/icons-react';
import Style from '@/styles/me/connections.module.css';
import useSWR from 'swr';
import { getMeSettings, setPublicProfile } from '@/lib/apiManager';

export const UserSettings = () => {
    const { data, isLoading, mutate } = useSWR(
        'userConnections',
        async () => await getMeSettings()
    );

    if (isLoading || !data) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconUser />
                Настройки аккаунта
            </h3>
            <SlideButton
                label="Публичный профиль"
                defaultValue={data.can_be_public ? data.public_profile : false}
                onChange={async state => {
                    await setPublicProfile({ state });
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
        </div>
    );
};
