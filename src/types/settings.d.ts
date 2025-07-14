interface SettingsResponse {
    userID: string;
    public_profile: boolean;
    can_be_public: boolean;
}

interface ConnectionsResponse {
    userID: string;
    discord: {
        user_id: number;
        name: string;
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
