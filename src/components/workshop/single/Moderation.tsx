import { Bandage } from '@/types/global';
import styles from '@/styles/workshop/moderation.module.css';
import {
    IconCircleDashedX,
    IconHourglassHigh,
    IconInfoCircle
} from '@tabler/icons-react';
import { TextFormatter } from '../TextFormatter';
import InfoCard from '../../InfoCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModerationType = { [key: string]: any };

const Moderation = ({ moderation }: { moderation: Bandage['moderation'] }) => {
    const icon: ModerationType = {
        review: <IconHourglassHigh />,
        denied: <IconCircleDashedX />,
        info: <IconInfoCircle />
    };

    const head: ModerationType = {
        review: 'На рассмотрении модерацией',
        denied: 'Работа отклонена модерацией',
        info: 'Официальная информация'
    };

    const color: ModerationType = {
        review: '#D29922',
        denied: '#ff0000'
    };

    const issuer_title: ModerationType = {
        review: 'Запрошен',
        denied: 'Просмотрено',
        info: 'Создан'
    };

    const header = (
        <h1 className={styles.header}>
            <span className={styles.type}>
                {icon[moderation.type]} {head[moderation.type]}
            </span>
            <span className={styles.issuer}>
                {issuer_title[moderation.type]} {moderation.issuer.name}
            </span>
        </h1>
    );

    let message = moderation.message;
    if (moderation.type === 'denied') {
        message = `Ваша работа была отклонена модерацией.`;
        if (moderation.message) {
            message = message + ` Сообщение модератора: ${moderation.message}`;
        }
    }

    return (
        <InfoCard
            title={header}
            color={color[moderation.type]}
            style={{
                marginBottom: '1rem',
                maxWidth: '1280px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}
        >
            <>
                <TextFormatter text={message} />
            </>
        </InfoCard>
    );
};

export default Moderation;
