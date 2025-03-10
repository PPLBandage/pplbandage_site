import SlideButton from '@/app/modules/components/SlideButton';
import { IconUser } from '@tabler/icons-react';
import Style from '@/app/styles/me/connections.module.css';
import useSWR from 'swr';
import ApiManager from '@/app/modules/utils/apiManager';

export const UserSettings = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await ApiManager.getMeSettings()
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
                onChange={state => ApiManager.setPublicProfile({ state })}
                disabled={!data.can_be_public}
                loadable
                strict
            />
        </div>
    );
};
