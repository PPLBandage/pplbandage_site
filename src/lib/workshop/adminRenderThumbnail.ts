import { useEffect } from 'react';
import useAccess from '../useAccess';
import { hasThumbnail, uploadThumbnail } from '../api/workshop';
import { renderQueue } from './RenderingQueue';
import { Bandage } from '@/types/global';
import AsyncImage from '../asyncImage';

const useRenderThumbnail = (id: Bandage) => {
    const access = useAccess();

    useEffect(() => {
        if (!access.includes(5) && !access.includes(8)) {
            return;
        }

        const render = async () => {
            const has_thumbnail = await hasThumbnail(id.external_id);
            if (has_thumbnail) return;

            console.info('Thumbnail not found! Rendering...');

            const { result } = renderQueue.enqueue({
                b64: id.base64,
                flags: id.flags,
                back: false
            });

            const rendered_result = await result;
            const renderImg = await AsyncImage(rendered_result);
            const backgroundImg = await AsyncImage('/static/background.png');

            const canvas = document.createElement('canvas');
            canvas.width = backgroundImg.width;
            canvas.height = backgroundImg.height;
            const ctx = canvas.getContext('2d')!;

            ctx.drawImage(backgroundImg, 0, 0);

            const x = (canvas.width - renderImg.width) / 2;
            const y = (canvas.height - renderImg.height) / 2;
            ctx.drawImage(renderImg, x, y);

            const blob: Blob = await new Promise((resolve, reject) =>
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/png')
            );

            const formData = new FormData();
            formData.append('file', blob, 'image.png');
            await uploadThumbnail(id.external_id, formData);

            console.info('Thumbnail rendered and uploaded!');
        };

        void render();
    }, []);
};

export default useRenderThumbnail;
