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
        async signIn({ user }) {
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
                }
                return true;
            } catch (error) {
                console.error("SignIn Error:", error);
                return true;
            }
        },
        async session({ session, token }) {
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.id || token.sub;
                // @ts-ignore
                session.user.betaAccess = token.betaAccess;
                // @ts-ignore
                session.user.credits = token.credits;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.id = user.id;

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
                    console.error("JWT Sync Error:", error);
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
