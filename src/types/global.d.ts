export interface Option {
    readonly value?: string;
    readonly label: React.JSX.Element;
    readonly isDisabled?: boolean;
}

export interface UserQuery {
    userID: string;
    username: string;
    name: string;
    joined_at: Date;
    banner_color: string;
    has_unreaded_notifications: boolean;
    profile_theme: number;
    stars_count: number;
    subscribers_count: number;
    roles: Category[];
    last_accessed?: Date;
}

export interface Users extends UserQuery {
    userID: string;
    works: Bandage[];
    works_count: number;
    is_self: boolean;
    is_subscribed?: boolean;
    profile_theme: number;
}

export interface Bandage {
    id: number;
    external_id: string;
    base64: string;
    base64_slim?: string;
    flags: number;
    average_og_color: string;
    userId: number;
    creation_date: Date;
    verified: boolean;
    stars_count: number;
    title: string;
    description: string;
    author: {
        id: number;
        username: string;
        name: string;
        public: boolean;
    };
    tags: string[];
    me_profile?: {
        uuid: string;
        nickname: string;
    };
    permissions_level: number;
    moderation: {
        type: string;
        message: string;
        is_hides: boolean;
        issuer: {
            id: string;
            name: string;
            username: string;
        };
    } | null;
    access_level: number;
    accent_color: string;
    star_type: number;
    archived: boolean;
    relevance_modifier?: number;
}

export interface BandageResponse {
    data: Bandage[];
    totalCount: number;
    next_page: number;
}

export interface Role {
    id: number;
    title: string;
    color: number;
}

export interface UserAdmins {
    data: {
        id: number;
        username: string;
        name: string;
        joined_at: Date;
        flags: number;
        permissions: number;
    }[];
    totalCount: number;
}

export interface INotifications {
    data: {
        id: number;
        content: string;
        author: string;
        type: number;
        creation_date: Date;
    }[];
    total_count: number;
}

export interface Session {
    id: number;
    last_accessed: Date;
    is_self: boolean;
    is_mobile: boolean;
    browser: string;
    browser_version: string;
}
