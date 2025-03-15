import ApiManager from '@/app/modules/utils/apiManager';
import Style from '@/app/styles/me/connections.module.css';
import {
    IconBrandDiscord,
    IconBrandMinecraft,
    IconPlugConnected,
    IconRefresh,
    IconX
} from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import { formatDateHuman } from '@/app/modules/components/Card';
import { b64Prefix } from '@/app/workshop/[id]/bandage_engine';
import { minecraftMono } from '@/app/modules/fonts/Minecraft';
import SlideButton from '@/app/modules/components/SlideButton';
import MinecraftConnect from '@/app/modules/components/MinecraftConnect';

export const Connections = () => {
    return (
        <>
            <Discord />
            <Minecraft />
        </>
    );
};

const Discord = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await ApiManager.getMeSettings()
    );
    if (isLoading) return null;
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandDiscord />
                Discord аккаунт
            </h3>
            <div className={Style.discord_container}>
                {data.connections?.discord && (
                    <Image
                        src={data.connections?.discord.avatar}
                        alt="avatar"
                        width={64}
                        height={64}
                        style={{ borderRadius: '50%' }}
                    />
                )}
                <div className={Style.discord_name_container}>
                    <h1>
                        {data.connections?.discord?.name ||
                            data.connections.discord.username}
                    </h1>
                    <p>
                        Подключено{' '}
                        {data.connections?.discord &&
                            formatDateHuman(
                                new Date(
                                    data.connections?.discord?.connected_at
                                )
                            )}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Minecraft = () => {
    const { data, isLoading } = useSWR(
        'userConnections',
        async () => await ApiManager.getMeSettings()
    );

    if (isLoading) return null;
    if (!data.connections.minecraft) return <UnloggedMinecraft />;

    return (
        <div className={Style.container}>
            <h3>
                <IconBrandMinecraft />
                Minecraft аккаунт
            </h3>
            <div className={Style.head_container}>
                {data && (
                    <Image
                        src={b64Prefix + data.connections.minecraft.head}
                        alt=""
                        width={64}
                        height={64}
                    />
                )}
                <div className={Style.name_container}>
                    <p className={`${Style.name} ${minecraftMono.className}`}>
                        {data.connections?.minecraft.nickname}
                    </p>
                    <p className={`${Style.uuid} ${minecraftMono.className}`}>
                        {data.connections?.minecraft.uuid}
                    </p>
                </div>
            </div>
            <div className={Style.checkboxes}>
                <SlideButton
                    label="Отображать ник в поиске"
                    defaultValue={data.connections?.minecraft?.valid}
                    strict={true}
                    loadable={true}
                    onChange={setValidAPI}
                />
                <SlideButton
                    label="Автоматически устанавливать скин в редакторе"
                    defaultValue={data.connections?.minecraft?.autoload}
                    strict={true}
                    loadable={true}
                    onChange={setAutoloadAPI}
                />
            </div>
            <div className={Style.checkboxes}>
                <span>
                    Последний раз кэшировано{' '}
                    <b>
                        {formatDateHuman(
                            new Date(data.connections.minecraft.last_cached),
                            true
                        )}
                    </b>
                </span>
                <button className={Style.unlink} onClick={refreshMinecraft}>
                    <IconRefresh id="refresh" />
                    Обновить кэш
                </button>

                <button className={Style.unlink} onClick={disconnect}>
                    <IconX />
                    Отвязать
                </button>
            </div>
        </div>
    );
};

const UnloggedMinecraft = () => {
    return (
        <div className={Style.container}>
            <h3>
                <IconBrandMinecraft />
                Minecraft аккаунт
            </h3>
            <p style={{ margin: 0 }}>
                Подключите свой аккаунт Minecraft, чтобы управлять кэшем скинов
                и настройками видимости вашего никнейма в поиске.
            </p>
            <MinecraftConnect onInput={connectMinecraft}>
                <button className={Style.unlink} style={{ width: '100%' }}>
                    <IconPlugConnected />
                    Подключить
                </button>
            </MinecraftConnect>
        </div>
    );
};

const refreshMinecraft = () => {
    const load_icon = document.getElementById('refresh');
    load_icon.setAttribute('class', Style.loading_class);

    ApiManager.purgeSkinCache()
        .then(() => mutate('userConnections'))
        .catch(response => alert(response.data.message))
        .finally(() => load_icon.removeAttribute('class'));
};

const disconnect = () => {
    const confirmed = confirm(
        'Отвязать учётную запись Minecraft? Вы сможете в любое время привязать ее обратно.'
    );
    if (!confirmed) return;

    ApiManager.disconnectMinecraft()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const setValidAPI = (state: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        ApiManager.setMinecraftVisible({ state })
            .then(() => resolve())
            .catch(reject);
    });
};

const setAutoloadAPI = (state: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        ApiManager.setMinecraftAutoload({ state })
            .then(() => resolve())
            .catch(reject);
    });
};

const connectMinecraft = async (code: string): Promise<void> => {
    await ApiManager.connectMinecraft(code);
    setTimeout(() => mutate('userConnections'), 150);
};
