import { useEffect } from 'react';
import useAccess from '../useAccess';
import { hasThumbnail, uploadThumbnail } from '../api/workshop';
import { renderQueue } from './RenderingQueue';
import { Bandage } from '@/types/global';

const useRenderThumbnail = (id: Bandage) => {
    const access = useAccess();

    useEffect(() => {
        const superAdmin = access.includes(5);
        if (!superAdmin && !access.includes(8)) {
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
            const blob = await (await fetch(rendered_result)).blob();
            const formData = new FormData();
            formData.append('file', blob, 'image.png');
            await uploadThumbnail(id.external_id, formData);

            console.info('Thumbnail rendered and uploaded!');
        };

        void render();
    }, []);
};

export default useRenderThumbnail;
