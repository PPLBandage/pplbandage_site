"use client";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AnimatedLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
    children: ReactNode;
    href: string;
    delay?: number;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<AnimatedLinkProps> = ({ children, href, ...props }) => {
    const router = useRouter();
    const pathname = usePathname();
    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (pathname.endsWith(href)) return;
        const body = document.getElementById("sidebar");
        if (body) {
            body.style.transform = 'translateY(50px)';
            body.style.opacity = '0';
        }

        await sleep(200);
        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};