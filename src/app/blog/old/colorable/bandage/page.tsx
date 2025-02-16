'use client';

import React from 'react';
import style from '@/app/styles/tutorials/common.module.css';
import { CustomLink } from '@/app/modules/components/Search';
import InfoCard from '@/app/modules/components/InfoCard';
import styleLink from '@/app/styles/tutorials/common.module.css';
import { IconAlertTriangle, IconBulb } from '@tabler/icons-react';

export default function Home() {
    return (
        <div className={style.animated} id="tutorials">
            <h1 style={{ marginTop: 0, fontSize: '2rem' }}>Создание повязки</h1>
            <p>
                На этой странице описан весь процесс создания повязки со всеми
                особенностями.
            </p>

            <InfoCard
                color="#3FB950"
                title={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '.5rem'
                        }}
                    >
                        <IconBulb width={24} height={24} />
                        <p style={{ margin: 0 }}>Совет</p>
                    </div>
                }
            >
                <p style={{ margin: 0 }}>
                    Старайтесь не копировать уже существующие повязки. Например,
                    если ваша работа дублирует один цвет уже существующей
                    окрашиваемой повязки, или если она имеет незначительные
                    различия с другой работой.
                </p>
            </InfoCard>

            <h1>Новый способ загрузки повязок</h1>
            <p>
                Обновленный метод загрузки повязок значительно удобнее
                предыдущего и автоматизирует процесс загрузки повязки с
                развертки скина.
            </p>

            <h2>Создание повязки</h2>
            <p>
                Для создания повязки можно использовать любые редакторы скинов,
                например Blockbench. Чтобы сайт корректно распознал повязку, её
                следует размещать на левой руке с широкой (или узкой) моделью.
            </p>

            <InfoCard
                color="#D29922"
                title={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '.5rem'
                        }}
                    >
                        <IconAlertTriangle width={24} height={24} />
                        <p style={{ margin: 0 }}>Важно</p>
                    </div>
                }
            >
                <p style={{ margin: 0 }}>
                    Так как движок автоматически определяет высоту повязки, на
                    руке с повязкой не должно быть лишних непрозрачных пикселей.
                    Они могут помешать точному определению высоты.
                </p>
            </InfoCard>

            <h2>Особенности для разных типов рук</h2>
            <p>
                Загружая развертки скинов на сайт нужно учитывать, что для
                каждого типа рук повязки должна быть развертка соответствующего
                типа.
            </p>

            <h1>Старый метод загрузки повязок</h1>
            <p>
                Этот метод все еще доступен на странице создания, но его
                использование в разы сложнее нового. Однако этот метод позволяет
                боле точно контролировать процесс сборки повязки.
            </p>

            <h2>Строение</h2>
            <p>Перед началом создания повязки важно понять её строение:</p>
            <ul>
                <li>
                    Файл повязки на сайте состоит из двух слоёв, которые
                    соединены вместе друг под другом.
                </li>
                <li>
                    Ширина <b>любой</b> повязки должна быть 16 пикселей.
                </li>
                <li>
                    Высота может быть любой в диапазоне от 1 до 12 пикселей
                    включительно.
                </li>
                <li>
                    Так как файл с повязкой состоит из одного изображения (1-й
                    пункт), диапазон высоты итогового изображения составляет от
                    2 до 24 пикселей включительно, а так же должен быть чётным.
                </li>
            </ul>

            <h2>Алгоритм наложения</h2>
            <p>
                Чтобы правильно создать повязку, нужно понимать процесс её
                наложения на скин.
            </p>

            <ol>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Разбиение одного файла на первый и второй слой:
                    </h4>
                    <p style={{ margin: 0 }}>
                        Входной файл делится пополам по высоте (именно поэтому
                        он должен быть чётной высоты). Верхняя половина идёт на
                        второй слой, а нижняя на первый.
                    </p>
                </li>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Адаптация под выбранную часть тела, тип рук:
                    </h4>
                    <p style={{ margin: 0 }}>
                        Если выбран узкий тип скина, то движок повязок обрезает
                        повязку слева и справа по одному пикселю. Учитывайте это
                        при создании повязки!
                        <br />
                    </p>
                </li>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Окрашивание повязки в заданный цвет.
                    </h4>
                    <p style={{ margin: 0 }}>
                        Об этом подробнее{' '}
                        <CustomLink href="/tutorials/colorable">
                            здесь
                        </CustomLink>
                        .
                    </p>
                </li>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Финальное наложение на скин.
                    </h4>
                    <p style={{ margin: 0 }}>
                        Диапазон позиций вычисляется как 12-
                        <span style={{ color: 'rgba(12, 247, 215)' }}>
                            `высота повязки`
                        </span>
                        .
                    </p>
                </li>
            </ol>

            <h2>Сборка повязки</h2>
            <p>
                После того, как вы нарисовали повязку, следует собрать её в
                понятный для сайта формат.
            </p>
            <InfoCard
                color="#3FB950"
                title={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '.5rem'
                        }}
                    >
                        <IconBulb width={24} height={24} />
                        <p style={{ margin: 0 }}>Заметка</p>
                    </div>
                }
            >
                <p style={{ margin: 0 }}>
                    Если вы рисуете повязку в программе Blockbench или подобной,
                    удобнее всего будет рисовать повязку на левой руке и со
                    стандартной моделькой скина. В таком случае будет легче
                    всего собрать повязку.
                </p>
            </InfoCard>
            <p>Процесс сборки можно разделить на два этапа:</p>
            <ol>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Определение размеров повязки.
                    </h4>
                    <p style={{ margin: 0 }}>
                        Так как ширина повязки всегда должна быть 16 пикселей,
                        определять нужно высоту. Если слои имеют различную
                        высоту, то нужно брать <b>максимальную</b> высоту слоя.
                        Учтите, что определенные границы первого и второго слоя
                        должны начинаться и заканчиваться на одной координате Y.
                    </p>
                    <h4 style={{ marginBottom: '.5rem' }}>Пример:</h4>
                    <a href="/static/tutorials/tutorial_1.png" target="_blank">
                        <img
                            alt="example_1"
                            src="/static/tutorials/tutorial_1.png"
                        />
                    </a>
                </li>
                <li>
                    <h4 style={{ marginBottom: '.5rem' }}>
                        Разбиение на слои.
                    </h4>
                    <p style={{ margin: 0 }}>
                        {' '}
                        После определения размеров повязки, нужно разделить её
                        на слои.
                        <br />
                        Создайте новый{' '}
                        <span style={{ color: 'rgba(12, 247, 215)' }}>
                            `.png`
                        </span>{' '}
                        файл шириной 16 пикселей и высотой, вдвое большей высоте
                        повязки. Поместите второй слой в верхнюю половину файла,
                        а первый — в нижнюю.
                    </p>
                    <h4 style={{ marginBottom: '.5rem' }}>Пример:</h4>
                    <a href="/static/tutorials/tutorial_2.png" target="_blank">
                        <img
                            alt="example_2"
                            src="/static/tutorials/tutorial_2.png"
                        />
                    </a>
                </li>
            </ol>

            <h2>Видеопример</h2>
            <video
                className={style.video}
                src="/static/tutorials/video.mp4"
                controls
            />
            <InfoCard
                color="#3FB950"
                title={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '.5rem'
                        }}
                    >
                        <IconBulb width={24} height={24} />
                        <p style={{ margin: 0 }}>Заметка</p>
                    </div>
                }
            >
                <p style={{ margin: 0 }}>
                    При создании повязки есть возможность загрузить отдельное
                    изображение для тонких рук скина. Правила создания повязки
                    остаются те же, как и для обычной повязки, за исключением
                    того, что обе повязки должны иметь одинаковую высоту.
                </p>
            </InfoCard>
            <p>
                И в общем это всё ¯\_(ツ)_/¯. Эти два этапа помогут вам
                правильно собрать свою повязку в понятный для сайта файл.
                Осталось только{' '}
                <CustomLink href="/workshop/create">
                    опубликовать её в мастерской
                </CustomLink>
                .
            </p>
            <h3>Несколько примеров:</h3>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.3rem'
                }}
            >
                <a
                    className={styleLink.CustomLink}
                    href="/static/tutorials/examples/ex_1.png"
                    download={'ex_1.png'}
                >
                    Пример №1
                </a>
                <a
                    className={styleLink.CustomLink}
                    href="/static/tutorials/examples/ex_2.png"
                    download={'ex_2.png'}
                >
                    Пример №2
                </a>
                <a
                    className={styleLink.CustomLink}
                    style={{ marginBottom: '1rem' }}
                    href="/static/tutorials/examples/ex_3.png"
                    download={'ex_3.png'}
                >
                    Пример №3
                </a>
            </div>
        </div>
    );
}
