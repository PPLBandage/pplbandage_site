'use client';

import { CSSProperties, useState } from 'react';
import NextImage from 'next/image';
import Style from '@/app/styles/openableImage.module.css';

interface openableImageProps {
    src: string;
    width: number;
    height: number;
    style?: CSSProperties;
    className?: string;
    bigStyle?: CSSProperties;
}
const OpenableImage = ({
    style,
    src,
    width,
    height,
    className,
    bigStyle
}: openableImageProps) => {
    const [opened, setOpened] = useState<boolean>(false);

    return (
        <>
            <NextImage
                src={src}
                width={width}
                height={height}
                alt=""
                style={style}
                onClick={() => setOpened(true)}
                className={`${className} ${Style.original_image}`}
            />
            {opened && (
                <div className={Style.div} onClick={() => setOpened(false)}>
                    <NextImage
                        src={src}
                        width={width}
                        height={height}
                        alt=""
                        style={bigStyle}
                    />
                </div>
            )}
        </>
    );
};

export default OpenableImage;
