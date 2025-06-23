import axios from 'axios';
import { redirect } from 'next/navigation';
import UsersClient from './client_code';
import { headers } from 'next/headers';
import { numbersTxt } from '@/lib/time';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Me } from '@/components/me/MeSidebar';
import { Users as UsersType } from '@/types/global';

export const generateMetadata = async ({
    params
}: {
    params: Promise<{ name: string }>;
}): Promise<Metadata> => {
    const props = await params;
    const headers_obj = Object.fromEntries([...(await headers()).entries()]);

    const meta = await axios.get(
        `${process.env.API_URL}/users/${props.name}/og`,
        {
            validateStatus: () => true,
            headers: { ...headers_obj, 'Unique-Access': process.env.TOKEN }
        }
    );

    const data = meta.data as UsersType;
    if (!data) return null;
    const works = numbersTxt(data.works_count, ['работа', 'работы', 'работ']);
    const stars = numbersTxt(data.stars_count, ['звезда', 'звезды', 'звёзд']);
    return {
        title: `${data.name} · Повязки Pepeland`,
        description: `Профиль пользователя ${data.name}`,
        openGraph: {
            title: `${data.name} · Автор`,
            description: `${works} – ${stars}`,
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
    const headers_obj = Object.fromEntries([...(await headers()).entries()]);
    const props = await params;

    const data_request = await axios.get(
        `${process.env.API_URL}/users/${props.name}`,
        {
            validateStatus: () => true,
            headers: { ...headers_obj, 'Unique-Access': process.env.TOKEN }
        }
    );

    const data = data_request.data as UsersType;
    if (data_request.status !== 200) notFound();
    if (!data) notFound();
    if (data.is_self) redirect('/me');

    return (
        <Me data={data}>
            <UsersClient user={data} />
        </Me>
    );
};

export default Users;
