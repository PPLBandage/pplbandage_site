import ASide from '@/components/tutorials/header';
import style from '@/styles/tutorials/common.module.css';

const TutorialsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className={style.main}>
            <div className={style.main_container}>
                <ASide />
                {children}
            </div>
        </main>
    );
};

export default TutorialsLayout;
