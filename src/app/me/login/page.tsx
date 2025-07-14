import { redirect } from 'next/navigation';

const Login = async () => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}auth/url/discord`);
};

export default Login;
