import Link from 'next/link';
import style from '@/app/styles/contacts/page.module.css';
import style_card from '@/app/styles/contacts/card.module.css';
import Image from 'next/image';
import { CSSProperties, JSX } from 'react';
import {
    IconAlertTriangle,
    IconBrandTelegram,
    IconExternalLink
} from '@tabler/icons-react';
import InfoCard from '../modules/components/InfoCard';
import Feedback from './Feedback.server';

interface CardProps {
    name: string;
    image: string;
    description: string;
    color: string;
    site_name: string;
    links: {
        name: string;
        URL: string;
        icon: JSX.Element;
    }[];
}

const Card = (props: CardProps) => {
    const links = props.links.map(link => {
        return (
            <Link
                href={link.URL}
                key={link.name}
                target="_blank"
                className={style_card.link}
            >
                {link.icon} {link.name}
            </Link>
        );
    });

    return (
        <article className={style_card.main}>
            <Image
                width={250}
                height={250}
                alt={props.name}
                src={props.image}
                className={style_card.img}
                style={{ '--shadow-color': props.color } as CSSProperties}
                unoptimized
            />
            <div className={style_card.info_container}>
                <div className={style_card.names}>
                    <Link
                        href={`/users/${props.site_name}`}
                        className={style_card.name}
                    >
                        {props.name}
                    </Link>
                    <p>{props.description}</p>
                </div>
                <div className={style_card.links_container}>{links}</div>
            </div>
        </article>
    );
};

const Home = () => {
    return (
        <main className={style.main}>
            <div className={style.header}>
                <h1>Контакты</h1>
                <InfoCard
                    color="#D29922"
                    title={
                        <div className={style_card.moderation_warn}>
                            <IconAlertTriangle width={24} height={24} />
                            <p style={{ margin: 0 }}>Внимание</p>
                        </div>
                    }
                    style={{ maxWidth: 'calc(500px + 1rem)' }}
                >
                    <p style={{ margin: 0 }}>
                        Не обращайтесь к модераторам PepeLand с вопросами по
                        данному сайту! Они не принимают непосредственного
                        участия в модерации повязок.
                    </p>
                </InfoCard>
                <div className={style.cards_container}>
                    <Card
                        name="AndcoolSystems"
                        image="/static/contacts/dino.gif"
                        description="Главный разработчик, модератор повязок"
                        color="#f8a824"
                        site_name="andcoolsystems"
                        links={[
                            {
                                name: 'Telegram',
                                URL: 'https://t.me/andcool_systems',
                                icon: (
                                    <IconBrandTelegram width={24} height={24} />
                                )
                            },
                            {
                                name: 'Telegram канал',
                                URL: 'https://tg.andcool.ru',
                                icon: (
                                    <IconBrandTelegram width={24} height={24} />
                                )
                            }
                        ]}
                    />

                    <Card
                        name="Shape STD"
                        image="/static/contacts/dino_like.gif"
                        description="Продакшн, дизайн повязок"
                        color="#689295"
                        site_name="gamdav_"
                        links={[
                            {
                                name: 'Telegram',
                                URL: 'https://t.me/shapestd',
                                icon: (
                                    <IconBrandTelegram width={24} height={24} />
                                )
                            },
                            {
                                name: 'ВК',
                                URL: 'https://vk.com/shapestd',
                                icon: (
                                    <IconExternalLink width={24} height={24} />
                                )
                            }
                        ]}
                    />
                </div>
                <Feedback />
            </div>
        </main>
    );
};

export default Home;
