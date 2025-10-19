interface SkinView3DOptions {
    style?: CSSProperties;
    width?: number;
    height?: number;
}

interface InitialReturningData {
    start_pos: number;
    start_time: number;
    running: boolean;
    grabbed: boolean;
}

interface HitRef {
    type: string;
    x: number;
    y: number;
}
