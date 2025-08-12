import {
    BlockbenchAnimationProviderProps,
    SkinViewBlockbench
} from 'skinview3d-blockbench';

export class AnimationController extends SkinViewBlockbench {
    constructor(props: BlockbenchAnimationProviderProps) {
        super(props);
    }

    onLoopEnd = () => {
        //this.setAnimation('new');
    };

    onFinish = (animation: SkinViewBlockbench) => {
        if (animation.animationName === 'new') {
            this.setAnimation('1_anim');
        }

        if (animation.animationName === 'initial') {
            this.setAnimation('new');
        }
    };
}
