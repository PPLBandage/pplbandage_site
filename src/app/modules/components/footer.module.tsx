import style from "@/app/styles/footer.module.css";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className={style.footer}>
            <div className={style.container}>
                <div className={style.links}>
                    <div className={style.links_cont}>
                        <Link href="/tos">Правила сайта</Link>
                        <Link href="/contacts">Контакты</Link>

                        <Link href="/tutorials">Туториалы</Link>
                        <Link href="https://www.donationalerts.com/r/andcool_systems" target="_blank">Поддержать</Link>
                        <Link href="https://github.com/PPLBandage" target="_blank">GitHub</Link>
                    </div>
                </div>
                <p className={style.beta}>PPLBandage project 2023–{new Date().getFullYear()}, <span style={{ display: 'flex', alignItems: 'flex-end' }} title={`Build ${process.env.NEXT_PUBLIC_BUILD_DATE}`}><img src="/static/icons/beta.svg" alt="" />–version</span></p>
                <p style={{ fontSize: ".8rem", margin: 0, marginTop: ".5rem" }}>NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</p>
            </div>
        </footer>
    )
}

export default Footer;