import { create } from 'zustand';

interface WorkshopState {
    page: number;
    take: number;
    search: string;
    sort: string;
    totalCount: number;

    setPage: (page: number) => void;
    setTake: (take: number) => void;
    setSearch: (search: string) => void;
    setSort: (sort: string) => void;
    setTotalCount: (totalCount: number) => void;
}

export const useWorkshopStore = create<WorkshopState>(set => ({
    page: 0,
    take: 12,
    search: '',
    sort: 'relevant_up',
    totalCount: 0,

    setPage: page => set({ page }),
    setTake: take => set({ take }),
    setSearch: search => set({ search }),
    setSort: sort => set({ sort }),
    setTotalCount: totalCount => set({ totalCount })
}));
