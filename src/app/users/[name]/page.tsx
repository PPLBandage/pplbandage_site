import { Bandage } from "@/app/interfaces";
import NotFound from "@/app/not-found";
import axios from "axios";
import { redirect } from "next/navigation";
import UsersClient from "./client_code";
import { headers } from "next/headers";
import { numbersTxt } from "@/app/modules/time.module";
import { Query } from "@/app/modules/header.module";

export interface Users extends Query {
    userID: number,
    works: Bandage[],
    is_self: boolean,
    profile_theme: number
}

const Users = async ({ params }: { params: { name: string } }) => {
    const headersList = headers()
    const cookie = headersList.get('Cookie');
    const userAgent = headersList.get('User-Agent');

    const data_request = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}users/${params.name}`, {
        withCredentials: true,
        validateStatus: () => true,
        headers: {
            "Cookie": cookie,
            "User-Agent": userAgent,
            "Unique-Access": process.env.TOKEN
        }
    });

    if (data_request.status !== 200) {
        return <NotFound />
    }

    const data = data_request.data as Users;
    if (data.is_self) {
        redirect('/me');
    }

    return (
        <>
            <meta property="og:title" content={`${data.name} · Автор`} />
            <meta property="og:description" content={`${numbersTxt(data.works.length, ['работа', 'работы', 'работ'])}`} />
            <meta property="og:url" content={`https://pplbandage.ru/users/${data.username}`} />
            <meta property="og:site_name" content="Повязки Pepeland" />
            <meta property="og:image" content={`${data.avatar}?size=256`} />
            <meta name="theme-color" content={data.banner_color} />
            <UsersClient user={data} />
        </>
    );

}

export default Users;