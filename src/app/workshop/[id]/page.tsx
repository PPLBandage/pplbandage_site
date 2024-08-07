import axios from "axios";
import Home from "./client_code";
import * as Interfaces from "@/app/interfaces";
import { headers } from 'next/headers';
import { notFound } from "next/navigation";

const Main = async ({ params }: { params: { id: string } }) => {
    const headersList = headers()
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

    if (initial_response.status !== 200) {
        notFound();
    }
    return (
        <>
            {data &&
                <>
                    <meta property="og:title" content={data.title} />
                    <meta property="og:description" content={data.description || 'Повязки Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!'} />
                    <meta property="og:url" content={`https://pplbandage.ru/workshop/${data.external_id}`} />
                    <meta property="og:site_name" content="Повязки Pepeland" />
                    <meta property="og:image" content={`/api/workshop/${data.external_id}/og`} />
                    <meta name="theme-color" content={data.average_og_color} />
                    <meta name="description" content={data.description || 'Повязки Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!'} />
                    <title>{`${data.title} · Повязки Pepeland`}</ title>
                </>
            }
            <Home data={data} />
        </>
    )
}

export default Main;