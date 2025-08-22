import { CSSProperties, JSX } from 'react';
import { IconAlertTriangle, IconBulb, IconInfoCircle } from '@tabler/icons-react';
import InfoCard from '@/components/InfoCard';
import style from '@/styles/blog/main.module.css';

const common_styles: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '.5rem'
};

export const Note = ({ children }: { children: JSX.Element }) => {
    return (
        <div style={{ marginBottom: '1rem' }} className={style.cont}>
            <InfoCard
                color="#4493F8"
                title={
                    <div style={common_styles}>
                        <IconInfoCircle width={24} height={24} />
                        <p style={{ margin: 0 }}>Примечание</p>
                    </div>
                }
            >
                {children}
            </InfoCard>
        </div>
    );
};

export const Tip = ({ children }: { children: JSX.Element }) => {
    return (
        <div style={{ marginBottom: '1rem' }} className={style.cont}>
            <InfoCard
                color="#3FB950"
                title={
                    <div style={common_styles}>
                        <IconBulb width={24} height={24} />
                        <p style={{ margin: 0 }}>Заметка</p>
                    </div>
                }
            >
                {children}
            </InfoCard>
        </div>
    );
};

export const Warn = ({ children }: { children: JSX.Element }) => {
    return (
        <div style={{ marginBottom: '1rem' }} className={style.cont}>
            <InfoCard
                color="#D29922"
                title={
                    <div style={common_styles}>
                        <IconAlertTriangle width={24} height={24} />
                        <p style={{ margin: 0 }}>Внимание</p>
                    </div>
                }
            >
                {children}
            </InfoCard>
        </div>
    );
};
