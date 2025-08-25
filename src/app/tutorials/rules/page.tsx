import { permanentRedirect } from 'next/navigation';

export default function Rules() {
    // Backwards compatibility
    permanentRedirect('/tos');
}

export const dynamic = 'force-static';
