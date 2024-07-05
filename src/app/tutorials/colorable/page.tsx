"use client";

import Footer from "@/app/modules/footer.module";
import Header from "@/app/modules/header.module";
import React from "react";
import style from '@/app/styles/tutorials/common.module.css';
import ASide from "../header.module";
import InfoCard from "@/app/modules/info.module";
import NextImage from 'next/image';
import { CategoryEl } from "@/app/modules/card.module";

export default function Home () {
    return (
        <body>
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <ASide />
                    <div className={style.animated}>
                        <h1 style={{marginTop: 0, fontSize: '2rem'}}>Окрашиваемые повязки</h1>
                        <p>Тут вы найдёте всё что нужно знать о процессе окрашивания повязок и как сделать это правильно.</p>

                        <h2>Создание окрашиваемой повязки</h2>
                        <p>Окрашиваемые повязки почти ничем не отличаются от обычных, единственным отличием является то, что они проходят дополнительный этап обработки на сайте.</p>
                        <p>Для начала разберёмся с процессом окрашивания. Движок повязок проходит по каждому пикселю в исходном изображении повязки и проверяет его цвет. Если все цветовые каналы равны, 
                            то есть <span style={{color: "rgba(12, 247, 215)"}}>r = g = b</span>, то движок заливает этот пиксель заданным цветом.</p>

                        <InfoCard color="#4493F8" title={
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem'}}>
                                <NextImage alt='' src='/static/icons/blocks/note.svg' width={20} height={20}/>
                                <p style={{margin: 0}}>Примечание</p>
                            </div>}>
                            <p style={{margin: 0}}>Итоговый цвет после заливки определяется формулой <span style={{color: "rgba(12, 247, 215)"}}>r / 255 * new_r</span>, где <span style={{color: "rgba(12, 247, 215)"}}>r</span> – это исходное значение канала цвета, 
                                а <span style={{color: "rgba(12, 247, 215)"}}>new_r</span> – это значение канала заливающего цвета. Эта формула применяется и к остальным каналам.</p>
                        </InfoCard>
                        <p>Как вы уже поняли, движок повязок заливает только пиксели оттенков серого и не умеет накладывать цвет на пикели, отличные от них.</p>

                        <InfoCard color="#3FB950" title={
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem'}}>
                                <NextImage alt='' src='/static/icons/blocks/tip.svg' width={20} height={20}/>
                                <p style={{margin: 0}}>Заметка</p>
                            </div>}>
                            <p style={{margin: 0}}>Если вам нужно сделать какой-либо пиксель незаливаемым, вы можете изменить значение одного из каналов цвета в этом пикселе на 1 и движок повязок пропустит его на этапе заливки.</p>
                        </InfoCard>
                    
                        <h2>Публикация окрашиваемой повязки</h2>
                        <span style={{display: 'block', marginTop: '.5rem', marginBottom: '.5rem'}}>Публикация окрашиваемой повязки ничем не отличается от публикации обычной повязки. Но на моменте выбора категорий вам нужно выбрать категорию <CategoryEl style={{display: 'inline-flex', height: '1rem', verticalAlign: 'top'}} category={{
                            id: -1,
                            name: "Окрашиваемые",
                            icon: '/static/icons/categories/color-palette.svg'
                        }} />. Таким образом вы отметите свою работу как окрашиваемую и на странице повязки в мастерской будет отображён соответствующий элемент выбора цвета.</span>
                    </div>
                </div>
                <Footer />
            </main>
        </body>
    )
}