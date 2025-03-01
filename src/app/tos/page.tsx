import { permanentRedirect } from 'next/navigation';

const TOS = () => {
    // for backwards compatibility :)
    permanentRedirect('/tutorials/rules');
};

export default TOS;
