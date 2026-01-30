import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isBetaUser = token?.betaAccess === true;
        const pathname = req.nextUrl.pathname;

        // Only redirect authenticated users who lack beta access
        if (token && pathname.startsWith("/dream") && !isBetaUser) {
            return NextResponse.redirect(new URL("/waitlist-pending", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // Allow middleware to pass; client-side will handle protection
        },
    }
);

export const config = {
    matcher: ["/dream/:path*", "/waitlist-pending"],
};
