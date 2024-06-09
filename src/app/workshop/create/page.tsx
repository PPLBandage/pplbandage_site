"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/api.module";
import Header from '../../modules/header.module';


export default function Home() {

    return (
    <body style={{backgroundColor: "#17181C", margin: 0}}>
        <Header/>
    </body>
    );
}