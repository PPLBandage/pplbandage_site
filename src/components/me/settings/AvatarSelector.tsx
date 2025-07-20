'use client';

import { getMeSettings, setUserSetting } from '@/lib/api/user';
import { JSX, useEffect, useState } from 'react';
import Select from 'react-select';
import useSWR from 'swr';
import Image from 'next/image';
import Style from '@/styles/me/connections.module.css';
import { StaticTooltip } from '@/components/Tooltip';
import { IconHelpCircleFilled } from '@tabler/icons-react';

type AvailableAvatarType = {
    label: JSX.Element;
    value: string;
};

const capitalize = (str: string) => str.at(0).toUpperCase() + str.slice(1);

const AvatarSelector = () => {
    const [selected, setSelected] = useState<AvailableAvatarType>(null);
    const [availableAvatars, setAvailableAvatars] = useState<AvailableAvatarType[]>(
        []
    );

    const { data, isLoading } = useSWR(
        'userSettings',
        async () => await getMeSettings()
    );

    const generateProviderRow = (provider: string) => ({
        label: (
            <span className={Style.avatars_providers}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data.userID}/${provider}`}
                    alt="avatar"
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%' }}
                />
                {capitalize(provider)}
            </span>
        ),
        value: provider
    });

    useEffect(() => {
        if (!data) return;

        const available = data.avatar.available.map(generateProviderRow);
        setAvailableAvatars(available);
        setSelected(generateProviderRow(data.avatar.current));
    }, [data]);

    return (
        <div className={Style.preferred_avatar}>
            <Select
                options={availableAvatars}
                value={selected}
                onChange={async evt => {
                    setSelected(evt);
                    await setUserSetting({ preferred_avatar: evt.value });
                }}
                className={`react-select-container`}
                classNamePrefix="react-select"
                isLoading={isLoading}
                isSearchable={false}
                instanceId="select-2"
            />
            <span>Предпочитаемый аватар</span>
            <StaticTooltip
                title="Изменения могут вступить в силу не сразу. Подождите несколько минут."
                container_styles={{ display: 'flex' }}
                tooltip_styles={{ minWidth: '10rem' }}
            >
                <IconHelpCircleFilled width={16} height={16} opacity={0.6} />
            </StaticTooltip>
        </div>
    );
};

export default AvatarSelector;
