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
    initial_animations = ['initial', 'initial_halloween'];
    action_animations = ['hand_view', 'leg_view', 'side_view', 'fly'];
    interactive_animations = ['hit', 'bottom_hit'];

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
        this.speed = 1;

        if (this.initial_animations.includes(this.animationName)) {
            this.setAnimation(this.getRandomActionAnim());
        } else if (
            this.action_animations.includes(this.animationName) ||
            this.interactive_animations.includes(this.animationName)
        ) {
            this.setAnimation('idle');
            this.scheduleAnimation();
        }
    };

    getRandomActionAnim() {
        let anim_choice = choice(this.action_animations);
        while (
            anim_choice === this.latest_scheduled_anim &&
            this.action_animations.length > 1
        ) {
            anim_choice = choice(this.action_animations);
        }
        this.latest_scheduled_anim = anim_choice;
        return anim_choice;
    }

    scheduleAnimation() {
        this.scheduled_iterations = randint(1, 4);
        this.scheduled_animation = this.getRandomActionAnim();

        this.log(
            `Scheduled animation "${this.scheduled_animation}" in ${this.scheduled_iterations} iterations`
        );
    }

    handleClick(type: string) {
        if (
            this.initial_animations.includes(this.animationName) ||
            this.action_animations.includes(this.animationName)
        )
            return;

        let anim_name: string = 'bottom_hit';
        switch (type) {
            case 'head':
                anim_name = 'hit';
                break;
            case 'body':
                anim_name = 'bottom_hit';
                break;
        }

        this.log(`Setting "${anim_name}" animation on click event`);
        this.setAnimation(anim_name);
        this.speed = 1.5;
    }

    log(message: string) {
        console.log(`[${AnimationController.name}] ${message}`);
    }
}
