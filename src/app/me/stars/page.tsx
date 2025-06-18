'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import style_sidebar from '@/styles/me/sidebar.module.css';
import styles_me from '@/styles/me/me.module.css';
import { Bandage } from '@/types/global.d';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { renderSkin } from '@/lib/SkinCardRender';
import { Placeholder } from '@/components/me/Placeholder';
import { getMeStars } from '@/lib/apiManager';

const Main = () => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    const render_skins = (data: Bandage[]) => {
        renderSkin(data.reverse(), styles_me).then(setElements);
    };

    useEffect(() => {
        getMeStars().then(render_skins).catch(console.error);
    }, []);

    if (elements === null) return null;
    if (elements.length === 0) return <Placeholder />;

    return (
        <div
            id="sidebar"
            className={`${style_sidebar.skins_container_2} ${style_sidebar.hidable}`}
        >
            <SimpleGrid>{elements}</SimpleGrid>
        </div>
    );
};

export default Main;
