import useSWR, { mutate } from 'swr';
import Style from '@/styles/me/connections.module.css';
import {
    IconBrandMinecraft,
    IconPlugConnected,
    IconRefresh,
    IconX
} from '@tabler/icons-react';
import Image from 'next/image';
import {
    connectMinecraft as connectMinecraftAPI,
    disconnectMinecraft,
    getMeConnections,
    purgeSkinCache,
    setMinecraftAutoload,
    setMinecraftVisible
} from '@/lib/apiManager';
import { minecraftMono } from '@/fonts/Minecraft';
import SlideButton from '@/components/SlideButton';
import { formatDateHuman } from '@/lib/time';
import MinecraftConnect from '../MinecraftConnect';
import DisconnectHelper from './DisconnectHelper';

export const Minecraft = () => {
    const { data, isLoading, mutate } = useSWR(
        'userConnections',
        async () => await getMeConnections()
    );

    if (isLoading) return null;
    if (!data.minecraft) return <UnloggedMinecraft />;

    return (
        <div className={Style.container}>
            <h3>
                <IconBrandMinecraft />
                Minecraft аккаунт
            </h3>
            <div className={Style.head_container}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/avatars/${data?.userID}/minecraft`}
                    alt=""
                    width={64}
                    height={64}
                />
                <div className={Style.name_container}>
                    <p className={`${Style.name} ${minecraftMono.className}`}>
                        {data.minecraft.nickname}
                    </p>
                    <p className={`${Style.uuid} ${minecraftMono.className}`}>
                        {data.minecraft.uuid}
                    </p>
                </div>
            </div>
            <div className={Style.checkboxes}>
                <SlideButton
                    label="Отображать ник в поиске"
                    defaultValue={data.minecraft.valid}
                    onChange={async state => {
                        await setMinecraftVisible({ state });
                        mutate({
                            ...data,
                            minecraft: {
                                ...data.minecraft,
                                autoload: state
                            }
                        });
                    }}
                    strict
                    loadable
                />
                <SlideButton
                    label="Автоматически устанавливать скин в редакторе"
                    defaultValue={data.minecraft.autoload}
                    onChange={async state => {
                        await setMinecraftAutoload({ state });
                        mutate({
                            ...data,
                            minecraft: {
                                ...data.minecraft,
                                autoload: state
                            }
                        });
                    }}
                    strict
                    loadable
                />
            </div>
            <div className={Style.checkboxes}>
                <span>
                    Последний раз кэшировано{' '}
                    <b>
                        {formatDateHuman(new Date(data.minecraft.last_cached), true)}
                    </b>
                </span>
                <button className={Style.unlink} onClick={refreshMinecraft}>
                    <IconRefresh id="refresh" />
                    Обновить кэш
                </button>

                <DisconnectHelper>
                    <button className={Style.unlink} onClick={disconnect}>
                        <IconX />
                        Отвязать
                    </button>
                </DisconnectHelper>
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
                Подключите свой аккаунт Minecraft, чтобы управлять кэшем скинов и
                настройками видимости вашего никнейма в поиске.
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

    purgeSkinCache()
        .then(() => mutate('userConnections'))
        .catch(response => alert(response.data.message))
        .finally(() => load_icon.removeAttribute('class'));
};

const disconnect = () => {
    const confirmed = confirm(
        'Отвязать учётную запись Minecraft? Вы сможете в любое время привязать ее обратно.'
    );
    if (!confirmed) return;

    disconnectMinecraft()
        .then(() => mutate('userConnections'))
        .catch(console.error);
};

const connectMinecraft = async (code: string): Promise<void> => {
    await connectMinecraftAPI(code);
    setTimeout(() => mutate('userConnections'), 150);
};
