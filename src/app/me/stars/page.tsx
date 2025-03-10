'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import style_sidebar from '@/app/styles/me/sidebar.module.css';
import styles_me from '@/app/styles/me/me.module.css';
import { Bandage } from '@/app/interfaces';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';
import { renderSkin } from '@/app/modules/utils/SkinCardRender';
import ApiManager from '@/app/modules/utils/apiManager';
import { Placeholder } from '../Placeholder';

const Main = () => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    const render_skins = (data: Bandage[]) => {
        renderSkin(data.reverse(), styles_me).then(setElements);
    };

    useEffect(() => {
        ApiManager.getMeStars().then(render_skins).catch(console.error);
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
