import axios from 'axios';
import Home from './client';
import * as Interfaces from '@/types/global.d';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { numbersTxt } from '@/lib/time';

export const generateMetadata = async ({
    params
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> => {
    const props = await params;
    const headers_obj = Object.fromEntries((await headers()).entries());

    const meta = await axios.get(
        `${process.env.API_URL}/workshop/${props.id}/info`,
        {
            validateStatus: () => true,
            headers: { ...headers_obj, 'Unique-Access': process.env.TOKEN }
        }
    );

    const data = meta.data.data as Interfaces.Bandage;
    if (!data) return null;
    const stars = numbersTxt(data.stars_count, ['звезда', 'звезды', 'звёзд']);
    return {
        title: `${data.title} · Повязки Pepeland`,
        description: data.description,
        openGraph: {
            title: `${data.title} · Повязки Pepeland`,
            description: `${data.description} – ${stars}`,
            url: `https://pplbandage.ru/workshop/${data.external_id}`,
            siteName: 'Повязки Pepeland',
            images: `https://pplbandage.ru/api/v1/workshop/${data.external_id}/og`
        },
        twitter: {
            card: 'summary_large_image'
        },
        other: {
            'theme-color': data.average_og_color
        }
    };
};

const addView = async (
    external_id: string,
    headers_obj: { [key: string]: string }
) => {
    try {
        const sessionId = (await cookies()).get('sessionId');
        if (!sessionId) return;

        await axios.post(
            `${process.env.API_URL}/workshop/${external_id}/view`,
            {},
            {
                validateStatus: () => true,
                headers: { ...headers_obj, 'Unique-Access': process.env.TOKEN }
            }
        );
    } catch (e) {
        console.log(e);
    }
};

const Main = async ({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[]>>;
}) => {
    const headers_obj = Object.fromEntries((await headers()).entries());
    const search = await searchParams;
    const props = await params;
    const referrer = search['ref'];

    await addView(props.id, headers_obj);
    const initial_response = await axios.get(
        `${process.env.API_URL}/workshop/${props.id}`,
        {
            validateStatus: () => true,
            headers: { ...headers_obj, 'Unique-Access': process.env.TOKEN }
        }
    );

    const data = initial_response.data.data as Interfaces.Bandage;

    if (initial_response.status !== 200) notFound();
    if (!data) notFound();
    return <Home data={data} referrer={referrer as string} />;
};

export default Main;
