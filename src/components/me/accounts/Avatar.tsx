'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import styles from '@/styles/me/connections.module.css';

export const Avatar = (props: ImageProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    return (
        <div
            className={`${styles.placeholders} ${
                !loading && styles.placeholders_out
            }`}
            style={props.style}
        >
            {!error && (
                <Image
                    {...props}
                    alt={props.alt}
                    onLoad={e => {
                        setLoading(false);
                        props.onLoad?.(e);
                    }}
                    onError={e => {
                        setError(true);
                        props.onError?.(e);
                    }}
                />
            )}
        </div>
    );
};
