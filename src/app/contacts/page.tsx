import Link from 'next/link';
import style from '@/app/styles/contacts/page.module.css';
import style_card from '@/app/styles/contacts/card.module.css';
import Image from 'next/image';
import { CSSProperties } from 'react';
import {
    IconAlertTriangle,
    IconBrandTelegram,
    IconCoffee,
    IconExternalLink
} from '@tabler/icons-react';
import InfoCard from '../modules/components/InfoCard';

interface CardProps {
    name: string;
    image: string;
    description: string;
    color: string;
    site_name: string;
    links: {
        name: string;
        URL: string;
        type: 'telegram' | 'URL' | 'coffee';
    }[];
}

const Card = (props: CardProps) => {
    const links = props.links.map(link => {
        let icon;
        switch (link.type) {
            case 'telegram':
                icon = <IconBrandTelegram width={24} height={24} />;
                break;
            case 'coffee':
                icon = <IconCoffee width={24} height={24} />;
                break;
            default:
                icon = <IconExternalLink width={24} height={24} />;
                break;
        }
        return (
            <Link
                href={link.URL}
                key={link.name}
                target="_blank"
                className={style_card.link}
            >
                {icon} {link.name}
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
                                type: 'telegram'
                            },
                            {
                                name: 'Поддержать',
                                URL: 'https://www.donationalerts.com/r/andcool_systems',
                                type: 'coffee'
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
                                type: 'telegram'
                            },
                            {
                                name: 'ВК',
                                URL: 'https://vk.com/shapestd',
                                type: 'URL'
                            }
                        ]}
                    />
                </div>
            </div>
        </main>
    );
};

export default Home;
