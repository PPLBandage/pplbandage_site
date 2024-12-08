"use client";

import Footer from './modules/components/Footer';
import Header from './modules/components/Header';
import NotFoundElement from './modules/components/NotFound';

export default function NotFound() {
    return (
        <body>
            <Header />
            <NotFoundElement />
            <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", boxSizing: "border-box" }}>
                <Footer />
            </div>
        </body>
    );
}