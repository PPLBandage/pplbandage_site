import { CSSProperties, JSX } from 'react';
import { IconAlertTriangle, IconBulb, IconInfoCircle } from '@tabler/icons-react';
import InfoCard from '@/components/InfoCard';
import style from '@/styles/blog/main.module.css';
import Link from 'next/link';

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

export const NextAnchor = ({
    href,
    children,
    ...props
}: {
    href: string;
    children: JSX.Element;
}) => {
    return href?.startsWith('/') ? (
        <Link href={href}>{children}</Link>
    ) : (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
        </a>
    );
};

export const Code = ({ children, ...props }: { children: JSX.Element }) => {
    return (
        <code className={style.code} {...props}>
            {children}
        </code>
    );
};

export const SImage = ({ children, ...props }: { children: JSX.Element }) => {
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img style={{ maxWidth: '100%' }} {...props}>
            {children}
        </img>
    );
};
