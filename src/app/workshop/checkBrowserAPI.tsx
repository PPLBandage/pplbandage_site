import AsyncImage from "../modules/utils/asyncImage";
import { sha256 } from 'js-sha256';
import style from '@/app/styles/browserAPINotification.module.css';
import { IconX } from "@tabler/icons-react";
import ReactCSSTransition from "../modules/components/CSSTransition";

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAABR0lEQVR4nH2QQWrjQBREnxrJyKjdtoXQYkJjyAGyySXmEtnlBEMOkUUOkb1PMVcQGMbMqjHGYCxhLLVhZKs7i8ZeDalNUZ9fn/oV8R1+/fAAlGnQxSjw65/othIbY7y19u6RUrLf7xmNRjx9/sR9bBEiwjmPEBG8P1JVlZ/NZnRdh7DWcj6fkVICIIRgOp2S53nQbw/8VXApIv6FEX3fczwekVJyj/JfPL+HF+JwnHQa+PfL3Rctl0uvtSZNU5RSVFUFwOVyQWsNgLWWYRio6zpUUpZkWRYSaq1ZrVbsdjvW6zV1Xd/fsdZiraVpGvq+J45jiqLAe8+tN7HdblFKkSQJwzCwWCwwxjCfz2nbFoDT6cR4PAZgMpngvcc5R9d1xM45AIwxKKW4Xq9orZFSIqWkLEvatqVpGpIkYbPZkOc5WZZxOBz4AtiqiNt8TBK7AAAAAElFTkSuQmCC';
const rightChecksum = 'a9c82f3cebcaf9ec0c796072fbdaee3f2118838ba7002fe7548df351c4e3b7f9';

export const calcChecksum = async () => {
    const img = await AsyncImage(image);

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pixelString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');

    return sha256(pixelString) === rightChecksum;
}


export const BrowserNotification = ({ expanded, onClose }: { expanded: boolean, onClose(): void }) => {
    return (
        <ReactCSSTransition
            state={expanded}
            timeout={400}
            classNames={{
                enter: style.menu_enter,
                exitActive: style.menu_exit_active,
            }}
        >
            <div className={style.container}>
                <div>
                    <p>Мы определили, что ваш браузер может некорректно отображать скины.</p>
                    <p>Если возникнут проблемы, попробуйте использовать другой браузер.</p>
                </div>
                <button onClick={onClose}><IconX /></button>
            </div>
        </ReactCSSTransition>
    );
}