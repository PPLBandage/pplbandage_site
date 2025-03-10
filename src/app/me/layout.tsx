import { JSX } from 'react';
import Wrapper from './Wrapper';

const Layout = ({ children }: { children: JSX.Element }) => {
    return <Wrapper>{children}</Wrapper>;
};

export default Layout;
