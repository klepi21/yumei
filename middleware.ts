import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isBetaUser = token?.betaAccess === true;

        // Only redirect authenticated users who lack beta access if they try to use the app
        if (req.nextUrl.pathname.startsWith("/dream") && !isBetaUser) {
            return NextResponse.redirect(new URL("/waitlist-pending", req.url));
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
