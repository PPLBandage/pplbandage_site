import style_sidebar from '@/app/styles/me/sidebar.module.css';
import styles_me from '@/app/styles/me/me.module.css';
import Image from 'next/image';

export const Placeholder = () => {
    return (
        <div
            className={
                `${style_sidebar.skins_container_2} ` +
                `${style_sidebar.animated} ` +
                `${style_sidebar.hidable}`
            }
            id="sidebar"
        >
            <p className={styles_me.theres_nothing_p}>
                <Image
                    src="/static/theres_nothing_here.png"
                    alt=""
                    width={56}
                    height={56}
                />
                Похоже, тут ничего нет
            </p>
        </div>
    );
};
