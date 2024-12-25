import Link from "next/link";
import style from './styles/page.module.css';
import style_card from './styles/card.module.css';
import Image from "next/image";
import { CSSProperties } from "react";
import { IconAlertTriangle, IconBrandTelegram, IconExternalLink } from "@tabler/icons-react";
import InfoCard from "../modules/components/InfoCard";


interface CardProps {
    name: string,
    image: string,
    description: string,
    color: string,
    site_name: string,
    links: {
        name: string,
        URL: string,
        type: 'telegram' | 'URL'
    }[]
}

const Card = (props: CardProps) => {
    const links = props.links.map(link => {
        let icon;
        switch (link.type) {
            case 'telegram':
                icon = <IconBrandTelegram width={24} height={24} />
                break;
            default:
                icon = <IconExternalLink width={24} height={24} />
                break;
        }
        return <Link href={link.URL} key={link.name} target="_blank" className={style_card.link}>{icon} {link.name}</Link>
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
                    <Link href={`/users/${props.site_name}`} className={style_card.name}>{props.name}</Link>
                    <p>{props.description}</p>
                </div>
                <div className={style_card.links_container}>
                    {links}
                </div>
            </div>
        </article>
    )
}


const Home = () => {
    return (
        <main className={style.main}>
            <div
                className={style.main_container}
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '2rem'
                    }}>Контакты</h1>
                <InfoCard
                    color="#D29922"
                    title={
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                            <IconAlertTriangle width={24} height={24} />
                            <p style={{ margin: 0 }}>Внимание</p>
                        </div>
                    }
                    style={{ maxWidth: 'calc(500px + 1rem)' }}
                >
                    <p style={{ margin: 0 }}>Не обращайтесь к модераторам PepeLand с вопросами по данному сайту! Они не принимают непосредственного участия в модерации повязок.</p>
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
                                name: 'Сайт',
                                URL: 'https://andcool.ru',
                                type: 'URL'
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
}

export default Home;