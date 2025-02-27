'use client';

import { Users } from './page';
import { JSX, useEffect, useState } from 'react';
import styles from '@/app/styles/me/me.module.css';
import { Me } from '@/app/modules/components/MeSidebar';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';
import { renderSkin } from '@/app/modules/utils/SkinCardRender';

const UsersClient = ({ user }: { user: Users }) => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    useEffect(() => {
        if (user.works) renderSkin(user.works, styles).then(setElements);
    }, []);

    return (
        <Me user_data={user}>
            <div
                style={
                    elements
                        ? { opacity: '1', transform: 'translateY(0)' }
                        : { opacity: '0', transform: 'translateY(50px)' }
                }
                className={styles.cont}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <SimpleGrid>{elements}</SimpleGrid>
                </div>
            </div>
        </Me>
    );
};

export default UsersClient;
