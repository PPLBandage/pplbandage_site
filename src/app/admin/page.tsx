"use client";

import { Cookies, useCookies } from "next-client-cookies";
import useCookie from "@/app/modules/useCookie.module";
import { useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import Header, { Query } from "@/app/modules/header.module";
import { authApi } from "@/app/modules/api.module";

const Admin = () => {
    const logged = useCookie('sessionId');
    const cookies = useRef<Cookies>(useCookies());
    const router = useRouter();

    if (!cookies.current.get('sessionId')) {
        redirect('/');
    }

    useEffect(() => {
        if (!logged) {
            redirect('/');
        }
    }, [logged]);

    useEffect(() => {
        authApi.get('user/me').then((response) => {
            if (response.status === 200) {
                const data = response.data as Query;
                if (!data.permissions.includes('admin')) {
                    router.replace('/');
                }
            }
        })
    }, [])

    return (
        <body>
            <Header />
        </body>
    );
}

export default Admin;