import { createContext, useContext } from "react";

export interface ConfigInterface {
    page: number,
    take: number,
    search?: string,
    filters?: string,
    sort?: string,
    totalCount: number,
    scroll?: number
}

export const ConfigContext = createContext<{ lastConfig: ConfigInterface }>(null);
export const useConfigContext = () => useContext(ConfigContext);