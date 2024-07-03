"use client";

import Footer from "@/app/modules/footer.module";
import Header from "@/app/modules/header.module";
import React from "react";
import style from '@/app/styles/tutorials/common.module.css';
import ASide from "../header.module";
import { CustomLink } from "@/app/modules/search.module";
import InfoCard from "@/app/modules/info.module";
import NextImage from "next/image";

export default function Home () {
    return (
        <body>
            <Header />
            <main className={style.main}>
                <div className={style.main_container}>
                    <ASide />
                    <div className={style.animated}>
                        <h1 style={{marginTop: 0, fontSize: '2rem'}}>Создание повязки</h1>
                        <p>На этой странице описан весь процесс создания повязки со всеми особенностями и нюансами.</p>
                        
                        <h2>Строение</h2>
                        <p>Перед тем как начать создание повязки, нужно рассказать о её строении:</p>
                        <ul>
                            <li>Повязка состоит из двух слоёв, которые соединены вместе друг под другом.</li>
                            <li>Ширина <b>любой</b> повязки должна быть 16 пикселей.</li>
                            <li>Высота может быть любой в диапазоне от 1 до 12 пикселей включительно.</li>
                            <li>Так как файл с повязкой состоит из одного изображения (1-й пункт), диапазон высоты итогового изображения составляет от 2 до 24 пикселей включительно, а так же должен быть чётным.</li>
                        </ul>

                        <h2>Алгоритм наложения</h2>
                        <p>Также чтобы правильно создать повязку, следует понимать, что с ней будет делать сайт при наложении.</p>

                        <ol>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Разбиение одного файла на первый и второй слой:</h4>
                                <p style={{margin: 0}}>Входной файл делится пополам по высоте (именно поэтому он должен быть чётной высоты). Верхняя половина идёт на второй слой, а нижняя на первый.</p>
                            </li>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Адаптация под выбранную часть тела, тип рук:</h4>
                                <p style={{margin: 0}}>Если выбран узкий тип скина, то движок повязок обрезает повязку слева и справа по одному пикселю. Учитывайте это при создании повязки!<br/>
                                Подробно рассказывать об адаптации повязки под правую руку и ногу не имеет смысла, нужно лишь знать то, что повязка будет выглядеть одинаково на левой и правой руке, 
                                единственное изменение, которая она претерпит – это "поворот" на 180° вокруг оси руки без отражения.</p>
                            </li>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Окрашивание повязки в заданный цвет.</h4>
                                <p style={{margin: 0}}>Об этом подробнее в <CustomLink href='/tutorials/colorable'>/tutorials/colorable</CustomLink>.</p>
                            </li>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Финальное наложение на скин.</h4>
                                <p style={{margin: 0}}>Диапазон позиций вычисляется как 12-*высота повязки*.</p>
                            </li>
                        </ol>

                        <h2>Сборка повязки</h2>
                        <p>После того как вы нарисовали повязку вам следует собрать её в понятный для сайта формат.</p>
                        <InfoCard color="#3FB950" title={
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem'}}>
                                <NextImage alt='' src='/static/icons/blocks/tip.svg' width={20} height={20}/>
                                <p style={{margin: 0}}>Заметка</p>
                            </div>}>
                            <p style={{margin: 0}}>Если вы рисуете повязку в программах по типу Blockbench или подобных, удобнее всего будет это делать на левой руке и со стандартной моделькой скина. В таком случае будет легче всего собрать повязку.</p>
                        </InfoCard>
                        <p>Для упрощения понимания я разделил сборку повязки на этапы:</p>
                        <ol>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Определение размеров повязки.</h4>
                                <p style={{margin: 0}}>Так как ширина повязки всегда должна быть 16 пикселей, определять нужно высоту. Если у вас слои имеют различную высоту, то нужно брать <b>максимальную</b> высоту слоя. Учтите, что определенные границы первого и второго слоя должны начинаться и заканчиваться на одной координате Y.</p>
                                <h4 style={{marginBottom: '.5rem'}}>Пример:</h4>
                                <img alt="example_1" src="/static/tutorials/tutorial_1.png"/>
                            </li>
                            <li>
                                <h4 style={{marginBottom: '.5rem'}}>Разбиение на слои.</h4>
                                <p style={{margin: 0}}></p>
                                
                            </li>
                        </ol>
                    </div>
                </div>
                <Footer />
            </main>
        </body>
    )
}