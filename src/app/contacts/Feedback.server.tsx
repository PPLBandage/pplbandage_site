import { Feedback_client } from './Feedback.client';
import { cookies } from 'next/headers';

const Feedback = async () => {
    const _cookies = await cookies();
    return (
        <Feedback_client
            feedback_available={
                new Date().getTime() >
                Number(_cookies.get('feedback_retry')?.value ?? 0)
            }
        />
    );
};

export default Feedback;
