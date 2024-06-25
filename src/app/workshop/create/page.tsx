"use client";

import React, { useEffect, useRef, useState } from 'react';
import Header from '@/app/modules/header.module';
import style from '@/app/styles/workshop/create/page.module.css';
import SkinView3D from '@/app/skinView.module';
import { anims } from '../poses';
import NextImage from 'next/image';
import Select from 'react-select';
import { SlideButton } from '@/app/modules/nick_search.module';
import Client from '../[id]/bandage_engine.module';
import Link from 'next/link';


export default function Home() {
    const [SKIN, setSKIN] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [pose, setPose] = useState<number>(1);

    const client = useRef<Client>(null);

    useEffect(() => {
        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: {skin: string, cape: string}) => {
            setSKIN(event.skin);
            setSlim(client.current.slim);
        });

        client.current.loadSkinUrl("/static/workshop_base.png");

    }, []);


    return (
    <body style={{backgroundColor: "#17181C", margin: 0}}>
        <Header/>
        <main className={style.main}>
            <div className={style.central_panel}>
                <aside className={style.skin_parent}>
                    <SkinView3D SKIN={SKIN}
                                CAPE={null} 
                                slim={slim} 
                                className={style.skinview}
                                pose={pose} 
                                id="canvas_container" />
                    
                    <div className={style.render_footer}>
                        <Select
                            options={anims}
                            defaultValue={anims[pose]}
                            className={`react-select-container`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={(n, a) => setPose(n.value)}
                            formatOptionLabel={(nick_value) => nick_value.label}
                        />
                        <SlideButton onChange={setSlim} value={slim} label="Тонкие руки"/>
                    </div>
                </aside>
                <div>
                    <h3 style={{margin: 0}}>Перед началом создания повязки прочитайте <Link href="/tutorials/bandage">туториал</Link></h3>
                </div>
            </div>
        </main>
    </body>
    );
}