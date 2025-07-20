interface SettingsResponse {
    userID: string;
    public_profile: boolean;
    can_be_public: boolean;
    avatar: {
        current: string;
        available: string[];
    };
}

interface ConnectionsResponse {
    userID: string;
    google: {
        sub: string;
        email: string;
        name: string;
        connected_at: Date;
    } | null;
    twitch: {
        uid: string;
        login: string;
        name: string;
        connected_at: Date;
    } | null;
    discord: {
        user_id: number;
        name: string;
        username: string;
        connected_at: Date;
    } | null;
    minecraft: {
        nickname: string;
        uuid: string;
        last_cached: number;
        valid: boolean;
        autoload: boolean;
    } | null;
}
