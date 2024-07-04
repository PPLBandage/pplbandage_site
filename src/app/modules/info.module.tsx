import Style from '@/app/styles/info.module.css';

interface InfoCardProps {
    title: JSX.Element | string;
    children: JSX.Element | string;
    color?: string
}


const InfoCard = ({title, children, color}: InfoCardProps) => {
    const _color = color || '#4493F8';
    return  (
            <div style={{borderColor: _color, background: `linear-gradient(90deg, ${_color} -10%, rgba(0,0,0,0) 40%)`}} className={Style.container}>
                <h3 className={Style.header}>{title}</h3>
                {children}
            </div>
    );
}

export default InfoCard;