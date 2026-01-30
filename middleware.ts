import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const pathname = req.nextUrl.pathname;

    // Case 1: NOT AUTHENTICATED
    // If trying to access protected paths without a token, go to signin
    if (!token) {
        if (pathname.startsWith("/dream") || pathname === "/waitlist-pending") {
            const url = new URL("/auth/signin", req.url);
            url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Case 2: AUTHENTICATED BUT NO BETA ACCESS
    // If they have a token but betaAccess is NOT true, kick them to waitlist
    const isBetaUser = token.betaAccess === true;

    if (pathname.startsWith("/dream") && !isBetaUser) {
        console.log(`🚫 Access Denied: User ${token.email} redirected to waitlist.`);
        return NextResponse.redirect(new URL("/waitlist-pending", req.url));
    }

    // Case 3: AUTHENTICATED AND HAS BETA ACCESS
    // If on waitlist page but allowed, send to the actual app
    if (pathname === "/waitlist-pending" && isBetaUser) {
        return NextResponse.redirect(new URL("/dream", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dream/:path*", "/waitlist-pending"],
};
