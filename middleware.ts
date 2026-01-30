import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isBetaUser = token?.betaAccess === true;
        const pathname = req.nextUrl.pathname;

        // If authenticated but no beta access, send to waitlist
        if (pathname.startsWith("/dream") && token && !isBetaUser) {
            return NextResponse.redirect(new URL("/waitlist-pending", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Return true if token exists
                return !!token;
            },
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

export const config = {
    matcher: ["/dream/:path*", "/waitlist-pending"],
};
