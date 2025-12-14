export interface Option {
    readonly value?: string;
    readonly label: React.JSX.Element;
    readonly isDisabled?: boolean;
}

export interface UserQuery {
    /**
     * Unique user identifier
     */
    userID: string;

    /**
     * A unique login, used in URL, etc.
     */
    username: string;

    /**
     * Displayed user name
     */
    name: string;

    /**
     * Date. when user registered account
     */
    joined_at: Date;

    /**
     * Hex color of user profile background
     */
    banner_color: string;

    /**
     * Boolean value, that indicates that user has unreaded notification
     * Automatically sets to `false`, when user queries their notifications
     */
    has_unreaded_notifications: boolean;

    /**
     * Theme of profile
     *
     * 0 - Default
     * 1 - Avatar as background
     * 2 - Solid color fill (`banner_color` value)
     */
    profile_theme: number;

    /**
     * Number of stars, that user has on their works
     */
    stars_count: number;

    /**
     * User' subscribers count
     */
    subscribers_count: number;

    /**
     * [admin-only] The latest access date of user' session
     */
    last_accessed?: Date;

    /**
     * Bit-set of user badges
     */
    badges: number;
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
        issue_date: Date;
    } | null;
    access_level: number;
    accent_color: string;
    star_type: number;
    archived: boolean;
    views: number;
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
    browser?: string;
    browser_version?: string;
}
