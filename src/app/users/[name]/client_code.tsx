"use client";

import Header from "@/app/modules/header.module";
import { Users } from "./page";
import style_sidebar from "@/app/styles/me/sidebar.module.css";
import { useEffect, useRef, useState } from "react";
import { Bandage } from "@/app/interfaces";
import { SkinViewer } from "skinview3d";
import { Card, generateSkin } from "@/app/modules/card.module";
import styles from "@/app/styles/me/me.module.css";
import { Me } from "@/app/modules/me.module";
import Link from "next/link";
import Footer from "@/app/modules/footer.module";

const UsersClient = ({ user }: { user: Users }) => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    useEffect(() => {
        if (user.works) {
            const skinViewer = new SkinViewer({
                width: 300,
                height: 300,
                renderPaused: true
            });
            skinViewer.camera.rotation.x = -0.4;
            skinViewer.camera.rotation.y = 0.8;
            skinViewer.camera.rotation.z = 0.29;
            skinViewer.camera.position.x = 17;
            skinViewer.camera.position.y = 6.5;
            skinViewer.camera.position.z = 11;
            skinViewer.loadBackground("/static/background.png").then(() => {
                Promise.all(user?.works.map(async (el) => {
                    try {
                        console.log(el.base64)
                        const result = await generateSkin(el.base64, Object.values(el.categories).some(val => val.id == 3));
                        console.log(result)
                        await skinViewer.loadSkin(result);
                        skinViewer.render();
                        const image = skinViewer.canvas.toDataURL();
                        return <Card el={el} base64={image} key={el.id} className={styles} />
                    } catch (e) {
                        console.error(e)
                        return;
                    }
                }))
                    .then(results => setElements(results))
                    .catch(error => console.error('Error generating skins', error))
                    .finally(() => skinViewer.dispose());
            });
        }
    }, []);

    return (
        <body>
            <title>{`${user.name} · Повязки Pepeland`}</title>
            <Header />
            <Me user_data={user}>
                <div style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }} className={styles.cont}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className={style_sidebar.skins_container}>
                            {elements}
                        </div>
                    </div>
                </div>
            </Me>
        </body>
    );
}

export default UsersClient;