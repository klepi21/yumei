import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // Allow middleware to pass; client-side will handle protection
        },
    }
);

export const config = {
    matcher: ["/dream/:path*"],
};
