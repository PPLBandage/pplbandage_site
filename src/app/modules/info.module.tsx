import Style from '@/app/styles/info.module.css';

interface InfoCardProps {
    title: JSX.Element | string;
    children: JSX.Element | string;
    color?: string
}

const InfoCard = ({title, children, color}: InfoCardProps) => {
    return  <div style={{backgroundColor: (color || '#0000ff') + '21', borderColor: color || '#0000ff'}} className={Style.container}>
                <h3 className={Style.header}>{title}</h3>
                {children}
            </div>
}

export default InfoCard;