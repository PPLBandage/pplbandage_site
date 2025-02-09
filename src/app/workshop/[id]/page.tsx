import axios from 'axios';
import Home from './client';
import * as Interfaces from '@/app/interfaces';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { numbersTxt } from '@/app/modules/utils/time';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const headersList = await headers();
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');

    const props = await params;

    const meta = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/${props.id}/info`, {
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            Cookie: cookie,
            'User-Agent': userAgent,
            'Unique-Access': process.env.TOKEN
        }
    });

    const data = meta.data.data as Interfaces.Bandage;
    if (!data) return null;
    return {
        title: `${data.title} · Повязки Pepeland`,
        description: data.description,
        openGraph: {
            title: `${data.title} · Повязки Pepeland`,
            description: `${data.description} – ${numbersTxt(data.stars_count, ['звезда', 'звезды', 'звёзд'])}`,
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

const addView = async (cookie: string | null, userAgent: string, external_id: string) => {
    try {
        if (!cookie) return;
        const sessionId = cookie
            .split('; ')
            .map((cookie) => cookie.split('='))
            .find((cookie) => cookie[0] === 'sessionId');
        if (!sessionId) return;

        await axios.post(
            `${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/${external_id}/view`,
            {},
            {
                validateStatus: () => true,
                headers: {
                    Cookie: cookie,
                    'User-Agent': userAgent,
                    'Unique-Access': process.env.TOKEN,
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0'
                }
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
    const headersList = await headers();
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');
    const search = await searchParams;
    const props = await params;
    const referrer = search['ref'];

    await addView(cookie, userAgent, props.id);

    const initial_response = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}workshop/${props.id}`, {
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            Cookie: cookie,
            'User-Agent': userAgent,
            'Unique-Access': process.env.TOKEN,
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0'
        }
    });
    const data = initial_response.data.data as Interfaces.Bandage;

    if (initial_response.status !== 200 || !data) {
        notFound();
    }

    return <Home data={data} referrer={referrer as string} />;
};

export default Main;
