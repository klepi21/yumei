import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // If they are on a /dream page, they MUST have betaAccess
        if (pathname.startsWith("/dream")) {
            const isBetaUser = token?.betaAccess === true;
            if (!isBetaUser) {
                console.log('🚫 Middleware: Non-beta user dynamic redirect to /waitlist-pending');
                return NextResponse.redirect(new URL("/waitlist-pending", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // User must be logged in for these routes
        },
        pages: {
            signIn: "/auth/signin",
        }
    }
);

export const config = {
    matcher: ["/dream/:path*", "/waitlist-pending"],
};
