import axios from "axios";
import Home from "./client_code";
import * as Interfaces from "@/app/interfaces";
import { headers } from 'next/headers';
import { notFound } from "next/navigation";
import { Metadata } from "next";


export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
    const meta = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/${params.id}/info`, {
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            'Unique-Access': process.env.TOKEN,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });

    const data = meta.data.data as Interfaces.Bandage;
    if (!data) return null;
    return {
        title: `${data.title} · Повязки Pepeland`,
        description: data.description,
        openGraph: {
            title: `${data.title} · Повязки Pepeland`,
            description: data.description,
            url: `https://pplbandage.ru/workshop/${data.external_id}`,
            siteName: 'Повязки Pepeland',
            images: `https://pplbandage.ru/api/workshop/${data.external_id}/og`
        },
        twitter: {
            card: 'summary_large_image'
        },
        other: {
            'theme-color': data.average_og_color
        }
    }
}

const Main = async ({ params }: { params: { id: string } }) => {
    const headersList = headers();
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');

    const initial_response = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/${params.id}`, {
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            'Cookie': cookie,
            'User-Agent': userAgent,
            'Unique-Access': process.env.TOKEN,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
    const data = initial_response.data.data as Interfaces.Bandage;

    if (initial_response.status !== 200 || !data) {
        notFound();
    }
    return <Home data={data} />;
}

export default Main;