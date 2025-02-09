import Style from '@/app/styles/info.module.css';
import { CSSProperties, JSX } from 'react';

interface InfoCardProps {
    title: JSX.Element | string;
    children: JSX.Element | string;
    style?: CSSProperties;
    color?: string;
}

const InfoCard = ({ title, children, color, style }: InfoCardProps) => {
    const _color = color || '#4493F8';
    return (
        <div style={{ borderLeftColor: _color, backgroundColor: `${_color}20`, ...style }} className={Style.container}>
            <h3 className={Style.header}>{title}</h3>
            {children}
        </div>
    );
};

export default InfoCard;
