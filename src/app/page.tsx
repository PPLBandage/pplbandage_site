import React from "react";
import axios from "axios";
import HomeClient from "./root_client";
import { headers } from "next/headers";


const Home = async () => {
    let pong = null;
    const headersList = headers();
    console.log(headersList.get('CF-IPCountry'))
    try {
        pong = await axios.get(process.env.NEXT_PUBLIC_GLOBAL_API_URL + 'ping', { validateStatus: () => true });
    } catch (e) {
        console.log(e);
    }
    return (
        <HomeClient pong={pong.status} />
    )
}

export default Home;