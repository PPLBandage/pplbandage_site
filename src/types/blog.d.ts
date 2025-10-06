// export type RepoContents = {
//     name: string;
//     path: string;
//     download_url: string;
// }[];
// Seems unused

export type LayoutContent = {
    title: string;
    description?: string;
    created: string;
    author: string;
    collaborators: string[];
    category: string;
    pinned: boolean;
};
