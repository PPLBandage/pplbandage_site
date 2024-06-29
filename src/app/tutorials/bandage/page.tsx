"use client";

import Footer from "@/app/modules/footer.module";
import Header from "@/app/modules/header.module";
import React from "react";
import style from '@/app/styles/tutorials/common.module.css';
import ASide from "../header.module";

export default function () {
    return (
        <body>
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <ASide />
                </div>
                <Footer />
            </main>
        </body>
    )
}