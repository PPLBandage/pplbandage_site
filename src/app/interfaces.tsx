export interface Option {
    readonly value?: string;
    readonly label: React.JSX.Element;
    readonly isDisabled?: boolean;
}

export interface Bandage {
    id: number;
    external_id: string,
    base64: string,
    base64_slim?: string,
    split_type: boolean,
    average_og_color: string,
    userId: number,
    creation_date: Date,
    verified: boolean,
    stars_count: number,
    starred: boolean,
    title: string,
    description: string,
    author: {
        id: number,
        username: string,
        name: string,
        public: boolean
    },
    categories: Category[],
    me_profile?: {
        uuid: string,
        nickname: string
    },
    permissions_level: number,
    check_state: string | null,
    access_level: number,
    accent_color: string
}

export interface Category {
    id: number,
    name: string,
    icon: string,
    enabled?: boolean
}

export interface BandageResponse {
    data: Bandage[],
    totalCount: number,
    next_page: number
}

export interface Role {
    id: number,
    title: string,
    color: number
}