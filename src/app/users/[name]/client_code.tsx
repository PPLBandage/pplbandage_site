"use client";

import Header from "@/app/modules/components/header.module";
import { Users } from "./page";
import { useEffect, useState } from "react";
import styles from "@/app/styles/me/me.module.css";
import { Me } from "@/app/modules/components/me.module";
import { SimpleGrid } from "@/app/modules/components/adaptiveGrid.module";
import { renderSkin } from "@/app/modules/utils/skinCardRender.module";

const UsersClient = ({ user }: { user: Users }) => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    useEffect(() => {
        user.works && renderSkin(user.works, styles).then(results => setElements(results));
    }, []);

    return (
        <body>
            <Header />
            <Me user_data={user}>
                <div style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }} className={styles.cont}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <SimpleGrid>{elements}</SimpleGrid>
                    </div>
                </div>
            </Me>
        </body>
    );
}

export default UsersClient;