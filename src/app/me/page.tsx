'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import styles from '@/app/styles/me/me.module.css';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';
import { renderSkin } from '../modules/utils/SkinCardRender';
import ApiManager from '../modules/utils/apiManager';
import { CreateCard } from '../modules/components/Card';
import { Bandage } from '../interfaces';

const Main = () => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

    const renderCards = (data: Bandage[]) => {
        renderSkin(data, styles).then(results => {
            if (!results.length) {
                setElements([]);
                return;
            }

            setElements([<CreateCard key={-1} />, ...results.reverse()]);
        });
    };

    useEffect(() => {
        ApiManager.getMeWorks().then(renderCards).catch(console.error);
    }, []);

    return (
        <>
            {!!elements && (
                <div className={styles.cont} id="sidebar">
                    {elements.length > 0 ? (
                        <SimpleGrid>{elements}</SimpleGrid>
                    ) : (
                        <CreateCard key={-1} />
                    )}
                </div>
            )}
        </>
    );
};

export default Main;
