import {
    BlockbenchAnimationProviderProps,
    SkinViewBlockbench
} from 'skinview3d-blockbench';

function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export class AnimationController extends SkinViewBlockbench {
    action_animations = ['hand_view', 'leg_view', 'side_view'];

    latest_scheduled_anim = '';
    scheduled_animation = '';
    scheduled_iterations = 0;

    constructor(props: BlockbenchAnimationProviderProps) {
        super(props);

        this.log(`Controller inited. Setting "${props.animationName}" animation`);
    }

    onLoopEnd = () => {
        if (
            this.animationName === 'idle' &&
            this.animationIteration >= this.scheduled_iterations
        ) {
            this.setAnimation(this.scheduled_animation);
            this.log(`Setting scheduled animation "${this.scheduled_animation}"`);
        }
    };

    onFinish = () => {
        if (this.animationName === 'initial') {
            this.log('Initial animation finished, setting "idle" animation');

            this.setAnimation('idle');
            this.scheduleAnimation();
        }

        if (this.action_animations.includes(this.animationName)) {
            this.setAnimation('idle');
            this.scheduleAnimation();
        }
    };

    scheduleAnimation() {
        this.scheduled_iterations = randint(1, 4);

        let anim_choice = choice(this.action_animations);
        while (anim_choice === this.latest_scheduled_anim) {
            anim_choice = choice(this.action_animations);
        }
        this.scheduled_animation = anim_choice;
        this.latest_scheduled_anim = anim_choice;

        this.log(
            `Scheduled animation "${anim_choice}" in ${this.scheduled_iterations} iterations`
        );
    }

    log(message: string) {
        console.log(`[AnimationController] ${message}`);
    }
}
