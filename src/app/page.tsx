import React from 'react';
import axios from 'axios';
import HomeClient from './root_client';

const Home = async () => {
    let pong = null;
    try {
        pong = await axios.get(`${process.env.API_URL}/ping`, {
            validateStatus: () => true
        });
    } catch {}
    return <HomeClient pong={pong?.status ?? 500} />;
};

export default Home;
