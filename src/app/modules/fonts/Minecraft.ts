import localFont from 'next/font/local';

export const minecraftMono = localFont({
    src: [
        {
            path: './Minecraft.ttf',
            weight: '500',
            style: 'normal'
        }
    ],
    variable: '--font-minecraft'
});
