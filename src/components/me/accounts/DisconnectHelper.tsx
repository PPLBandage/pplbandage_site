import { getMeConnections } from '@/lib/api/connections';
import { JSX } from 'react';
import useSWR from 'swr';

const DisconnectHelper = ({ children }: { children: JSX.Element }) => {
    const { data } = useSWR('userConnections', async () => await getMeConnections());

    if (!data) return undefined;

    const providers_count = Object.values(data).filter(
        i => typeof i === 'object' && i !== null
    ).length;

    if (providers_count <= 1) return undefined;
    return children;
};

export default DisconnectHelper;
