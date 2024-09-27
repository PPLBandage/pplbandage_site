"use client";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AnimatedLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
    children: ReactNode;
    href: string;
    delay?: number; // задержка перед переходом (в миллисекундах)
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<AnimatedLinkProps> = ({ children, href, ...props }) => {
    const router = useRouter();
    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const body = document.getElementById("tutorials");
        if (body) {
            body.style.transform = 'translateY(50px)';
            body.style.opacity = '0';
        }

        await sleep(400);
        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};