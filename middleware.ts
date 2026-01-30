import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isBetaUser = token?.betaAccess === true;
        const isWaitlistPage = req.nextUrl.pathname === "/waitlist-pending";
        const isDreamPage = req.nextUrl.pathname.startsWith("/dream");

        // Case 1: User has NO beta access but tries to go to /dream -> Send to waitlist
        // Only redirect if we HAVE a token but no access. If NO token, withAuth handles it.
        if (token && isDreamPage && !isBetaUser) {
            return NextResponse.redirect(new URL("/waitlist-pending", req.url));
        }

        // Case 2: User HAS beta access but is on waitlist page -> Send to dream
        if (token && isWaitlistPage && isBetaUser) {
            return NextResponse.redirect(new URL("/dream", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

export const config = {
    matcher: ["/dream/:path*", "/waitlist-pending"],
};
