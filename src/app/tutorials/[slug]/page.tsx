import { permanentRedirect } from 'next/navigation';

export default async function TutorialPlaceholder({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    // Backwards compatibility
    const params_awaited = await params;
    permanentRedirect(`/blog/${params_awaited.slug}`);
}

export const dynamic = 'force-static';
