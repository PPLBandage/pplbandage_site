import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const url = new URL(request.url);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-Path', url.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}
