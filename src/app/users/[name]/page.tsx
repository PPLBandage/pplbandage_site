import { Bandage } from '@/app/interfaces';
import axios from 'axios';
import { redirect } from 'next/navigation';
import UsersClient from './client_code';
import { headers } from 'next/headers';
import { numbersTxt } from '@/app/modules/utils/time';
import { Query } from '@/app/modules/components/Header';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export interface Users extends Query {
    userID: number;
    works: Bandage[];
    works_count: number;
    is_self: boolean;
    profile_theme: number;
}

export const generateMetadata = async ({
    params
}: {
    params: Promise<{ name: string }>;
}): Promise<Metadata> => {
    const props = await params;
    const meta = await axios.get(
        `${process.env.NEXT_PUBLIC_GLOBAL_API_URL}users/${props.name}/og`,
        {
            validateStatus: () => true,
            withCredentials: true,
            headers: {
                'Unique-Access': process.env.TOKEN,
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
                Expires: '0'
            }
        }
    );

    const data = meta.data as Users;
    if (!data) return null;
    return {
        title: `${data.name} · Повязки Pepeland`,
        description: `Профиль пользователя ${data.name}`,
        openGraph: {
            title: `${data.name} · Автор`,
            description: `${numbersTxt(data.works_count, [
                'работа',
                'работы',
                'работ'
            ])} – ${numbersTxt(data.stars_count, [
                'звезда',
                'звезды',
                'звёзд'
            ])}`,
            url: `https://pplbandage.ru/users/${data.username}`,
            siteName: 'Повязки Pepeland',
            images: data.avatar
        },
        twitter: {
            card: 'summary'
        },
        other: {
            'theme-color': data.banner_color
        }
    };
};

const Users = async ({ params }: { params: Promise<{ name: string }> }) => {
    const headersList = await headers();
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');
    const props = await params;

    const data_request = await axios.get(
        `${process.env.NEXT_PUBLIC_GLOBAL_API_URL}users/${props.name}`,
        {
            withCredentials: true,
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

    if (data_request.status !== 200) {
        notFound();
    }

    const data = data_request.data as Users;
    if (!data) {
        notFound();
    }

    if (data.is_self) {
        redirect('/me');
    }

    return <UsersClient user={data} />;
};

export default Users;
