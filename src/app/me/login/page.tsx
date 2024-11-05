import axios from "axios";
import { redirect } from "next/navigation";


const Login = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_GLOBAL_API_URL}auth/url`,
        {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }
    );
    if (response.status !== 200) redirect('/me');
    redirect(response.data.url);
}

export default Login;