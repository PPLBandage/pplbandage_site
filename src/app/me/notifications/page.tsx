"use client";

import React, { useEffect } from 'react';
import { redirect, } from "next/navigation";
import Style from "@/app/styles/me/notifications.module.css";
import Header from "@/app/modules/header.module";
import useCookie from '@/app/modules/useCookie.module';
import { Me } from '@/app/modules/me.module';

const Main = () => {
    const logged = useCookie('sessionId');

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    return (
    <body>
        <Header/>
        <Me>
            <div className={Style.container}>
                <img alt="crane" src='/static/icons/crane.svg'/>
                <h1>Раздел в разработке</h1>
            </div>
        </Me>
    </body>
    );
}

export default Main;