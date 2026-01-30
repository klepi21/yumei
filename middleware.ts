import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isBetaUser = token?.betaAccess === true;
        const pathname = req.nextUrl.pathname;

        // 1. If trying to access /dream but have NO beta access -> send to waitlist
        if (pathname.startsWith("/dream") && !isBetaUser) {
            return NextResponse.redirect(new URL("/waitlist-pending", req.url));
        }

        // 2. If ALREADY on waitlist but HAS beta access -> send to /dream
        if (pathname === "/waitlist-pending" && isBetaUser) {
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
