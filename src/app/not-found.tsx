"use client";

import Footer from './modules/components/footer.module';
import Header from './modules/components/header.module';
import NotFoundElement from './modules/components/nf.module';

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