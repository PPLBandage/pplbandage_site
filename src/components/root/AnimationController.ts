import {
    BlockbenchAnimationProviderProps,
    SkinViewBlockbench
} from 'skinview3d-blockbench';

export class AnimationController extends SkinViewBlockbench {
    constructor(props: BlockbenchAnimationProviderProps) {
        super(props);
    }

    onLoopEnd = (animation: SkinViewBlockbench) => {
        if (animation.animation_iteration >= 2) {
            this.setAnimation({ animationName: 'new' });
        }
    };

    onFinish = (animation: SkinViewBlockbench) => {
        if (animation.current_animation_name === 'new') {
            this.setAnimation({ animationName: '1_anim' });
        }

        if (animation.current_animation_name === 'initial') {
            this.setAnimation({ animationName: 'new' });
        }
    };
}
