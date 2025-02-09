import React from 'react';
import axios from 'axios';
import HomeClient from './root_client';

const Home = async () => {
    let pong = null;
    try {
        pong = await axios.get(process.env.NEXT_PUBLIC_GLOBAL_API_URL + 'ping', { validateStatus: () => true });
    } catch (e) {}
    return <HomeClient pong={pong?.status} />;
};

export default Home;
