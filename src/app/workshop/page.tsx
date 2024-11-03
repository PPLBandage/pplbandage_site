import axios from "axios";
import WorkshopClient from "./client";
import { headers } from "next/headers";

const Workshop = async () => {
    const headersList = headers();
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');
    let recommendations_available = false;
    try {
        const state_response = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/recommendations/available`, {
            validateStatus: () => true,
            withCredentials: true,
            headers: {
                'Cookie': cookie,
                'User-Agent': userAgent
            }
        });
        recommendations_available = (state_response.data as { state: boolean }).state;
    } catch { }
    return <WorkshopClient recommendations_available={recommendations_available} />
}

export default Workshop;