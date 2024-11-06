import { redirect } from "next/navigation";


const Login = async () => {
    redirect(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}auth/url`);
}

export default Login;