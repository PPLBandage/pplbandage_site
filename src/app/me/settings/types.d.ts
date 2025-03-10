interface SettingsResponse {
    statusCode: number;
    public_profile: boolean;
    can_be_public: boolean;
    connections: {
        discord: {
            user_id: number;
            username: string;
            name: string;
            connected_at: Date;
            avatar: string;
        };
        minecraft?: {
            nickname: string;
            uuid: string;
            last_cached: number;
            head: string;
            valid: boolean;
            autoload: boolean;
        };
    };
}
