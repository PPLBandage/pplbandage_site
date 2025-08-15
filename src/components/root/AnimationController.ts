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

    onFinish = () => {
        if (this.animationName === 'new') {
            this.setAnimation('1_anim');
        }

        if (this.animationName === 'initial') {
            this.setAnimation('new');
        }
    };
}
