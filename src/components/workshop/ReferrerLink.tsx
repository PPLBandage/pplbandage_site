import { useConfigContext } from '@/lib/ConfigContext';
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
    const context = useConfigContext();

    const handleTransition = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (pathname.endsWith(href)) return;
        window.sessionStorage.setItem('referrer', pathname);
        if (context && context.lastConfig) {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            window.sessionStorage.setItem(
                'workshopState',
                JSON.stringify({ scroll })
            );
        }
        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};

export default ReferrerLink;
