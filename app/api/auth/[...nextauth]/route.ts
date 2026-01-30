import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await dbConnect();

                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        betaAccess: false,
                    });
                } else {
                    // Update image if changed (optional)
                    if (existingUser.image !== user.image) {
                        existingUser.image = user.image;
                        await existingUser.save();
                    }
                }
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async session({ session, token }) {
            // Pass token data to the session (client-side)
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.betaAccess = token.betaAccess;
                // @ts-ignore
                session.user.credits = token.credits;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in or subsequent checks
            if (token.email) {
                try {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.betaAccess = dbUser.betaAccess;
                        token.credits = dbUser.credits || 0;
                        token.id = dbUser._id.toString();
                    }
                } catch (error) {
                    console.error("Error fetching user in JWT callback:", error);
                }
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
