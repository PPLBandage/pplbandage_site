import Link, { LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ReferrerLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
        LinkProps {
    children: ReactNode;
    href: string;
}

const ReferrerLink: React.FC<ReferrerLinkProps> = ({ children, href, ...props }) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleTransition = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (pathname.endsWith(href)) return;
        window.sessionStorage.setItem('referrer', pathname);

        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};

export default ReferrerLink;
