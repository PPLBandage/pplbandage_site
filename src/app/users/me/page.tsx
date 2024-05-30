"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/api.module";
import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            authApi.get(`oauth/discord/${code}`);
            router.replace('/users/me');
        }
        return () => {}
    })

    return (
    <body>
        <button onClick={() => {
            //authApi.get(`oauth/discord/${code}`);
            authApi.get(`oauth/users/me`);
        }}>test</button>
    </body>
    );
}