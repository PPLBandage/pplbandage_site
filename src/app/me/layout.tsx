import { JSX } from 'react';
import Wrapper from '@/components/me/Wrapper';

const Layout = ({ children }: { children: JSX.Element }) => {
    return <Wrapper>{children}</Wrapper>;
};

export default Layout;
