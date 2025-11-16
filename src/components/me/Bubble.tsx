'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';

const raysCount = 50;
const full_circle = Math.PI * 2;
const scale = 0.75;

const hexToRgba = (hex: string, alpha: number) => {
    let r = 0,
        g = 0,
        b = 0;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
};

export const Bubble = ({
    colors,
    width,
    height,
    styles
}: {
    colors: string[];
    width: number;
    height: number;
    styles?: CSSProperties;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrame = useRef<number>(0);
    const noise = useRef<NoiseFunction3D[]>([]);

    const render = () => {
        if (!canvasRef.current) return;
        const cw = canvasRef.current.width;
        const ch = canvasRef.current.height;

        const ctx = canvasRef.current.getContext('2d', {
            willReadFrequently: true
        })!;
        ctx.globalCompositeOperation = 'screen';
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        let color = 0;
        for (const layer of noise.current) {
            let path = '';
            // eslint-disable-next-line react-hooks/purity
            const time = Date.now() / 15000;
            for (
                let angle = 0;
                angle <= full_circle;
                angle += full_circle / raysCount
            ) {
                const nx = Math.cos(angle) * scale;
                const ny = Math.sin(angle) * scale;

                const noise_ = layer(nx, ny, time);
                const radius =
                    ((noise_ + 1) / 2) ** 0.15 * (Math.min(cw, ch) / 2 - 10);

                const x = (Math.cos(angle) * radius + cw / 2).toFixed(2);
                const y = (Math.sin(angle) * radius + ch / 2).toFixed(2);

                if (angle === 0) {
                    path = `M${x} ${y}`;
                }

                path += ` L ${x} ${y}`;
            }

            ctx.fillStyle = hexToRgba(colors[color], 1);
            ctx.fill(new Path2D(`${path} Z`));

            color++;
        }

        const imageData = ctx.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r === 255 && g === 255 && b === 255) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        animationFrame.current = requestAnimationFrame(render);
    };

    useEffect(() => {
        noise.current = Array.from({ length: colors.length }, () =>
            createNoise3D(() => Math.random())
        );
        animationFrame.current = requestAnimationFrame(render);

        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                filter: 'blur(3px)',
                ...styles
            }}
        />
    );
};
