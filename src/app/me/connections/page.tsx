import { permanentRedirect } from 'next/navigation';

const Connections = () => {
    // for backwards compatibility :)
    permanentRedirect('/me/settings');
};

export default Connections;
