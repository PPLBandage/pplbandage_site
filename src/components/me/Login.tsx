import MinecraftConnect from '@/components/me/MinecraftConnect';
import styles from '@/styles/me/me.module.css';
import {
    IconBrandDiscord,
    IconBrandGoogleFilled,
    IconBrandMinecraft,
    IconBrandTelegram,
    IconBrandTwitch,
    IconLogin
} from '@tabler/icons-react';
import { loginMinecraft as loginMinecraftAPI } from '@/lib/api/auth';
import { CSSProperties } from 'react';

export const Login = () => {
    const loginMinecraft = async (code: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            loginMinecraftAPI(code)
                .then(() => {
                    window.location.reload();
                    resolve();
                })
                .catch(reject);
        });
    };

    return (
        <main className={styles.login_main}>
            <div className={styles.login_container}>
                <h1
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.5rem'
                    }}
                >
                    <IconLogin />
                    Войти через
                </h1>

                <a
                    className={styles.login_button}
                    href={'/api/v1/auth/url/google'}
                    style={
                        {
                            '--color': '#FBBC04',
                            marginBottom: '.5rem'
                        } as CSSProperties
                    }
                >
                    <IconBrandGoogleFilled />
                    Google
                </a>
                <div className={styles.login_through}>
                    <div
                        className={styles.login_through_column}
                        style={{ gridArea: 'cl' }}
                    >
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/discord'}
                            style={{ '--color': '#5662f6' } as CSSProperties}
                        >
                            <IconBrandDiscord />
                            Discord
                        </a>
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/telegram'}
                            style={{ '--color': '#24A1DE' } as CSSProperties}
                        >
                            <IconBrandTelegram />
                            Telegram
                        </a>
                    </div>
                    <div
                        className={styles.login_through_column}
                        style={{ gridArea: 'cr' }}
                    >
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/twitch'}
                            style={{ '--color': '#6441a5' } as CSSProperties}
                        >
                            <IconBrandTwitch />
                            Twitch
                        </a>
                        <MinecraftConnect onInput={loginMinecraft} login>
                            <div
                                className={styles.login_button}
                                style={{ '--color': '#56ff4b' } as CSSProperties}
                            >
                                <IconBrandMinecraft />
                                Minecraft
                            </div>
                        </MinecraftConnect>
                    </div>
                </div>
                <p style={{ color: 'gray', marginBottom: 0 }}>
                    Регистрируясь на сайте вы соглашаетесь с настоящими{' '}
                    <a
                        className={styles.a}
                        href="/tutorials/rules"
                        style={{ color: 'gray' }}
                    >
                        условиями пользования
                    </a>
                </p>
            </div>
        </main>
    );
};
