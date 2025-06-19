import style from '@/styles/workshop/tag.module.css';

const TagElement = ({ title }: { title: string }) => {
    return (
        <div className={style.container}>
            <p>{title}</p>
        </div>
    );
};

export default TagElement;
